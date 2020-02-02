import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row, createRowsValue, RowGroupsValue } from "../../types/valueTypes";
import { asNumber } from "../../utils/converters";
import { pushDistinct } from "../../utils/arrayUtils";
import { AggregatorType, createAggregator } from "./aggregators";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

const PORT_GROUPS = 'groups';
const PORT_ROWS = 'rows';

class AggregateNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly alias: string,
        private readonly aggType: AggregatorType,
        private readonly columnMapper: expressions.Mapper,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.AGGREGATE
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_GROUPS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.subs.push(sub);
        }
    }

    onNext(value: unknown) {
        if (!this.subs.length) return;

        const rg = value as RowGroupsValue;
        const rows: Row[] = [];
        const aggregator = createAggregator(this.aggType);

        const rowGroups = rg.groups;
        for (let i = 0, n = rowGroups.length; i < n; i++) {
            const rowGroup = rowGroups[i];
            const subRows = rowGroup.rows;
            let subAmt: number | undefined = undefined;

            for (let j = 0, m = subRows.length; j < m; j++) {
                const subRow = subRows[j];
                const ctx = rowToEvalContext(subRow, j, this.context);
                const value = asNumber(this.columnMapper(ctx));
                subAmt = aggregator(subAmt, value, j);
            }

            rows.push({
                ...rowGroup.selection,
                [this.alias]: subAmt
            });
        }
        
        for (const sub of this.subs) {
            sub(createRowsValue(rows));
        }
    }
}

export const AGGREGATE_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Aggregate',
    menuGroup: 'Transform',
    description: 'Applies an aggregation function on the rows within each group.',
    ports: {
        in: {
            [PORT_GROUPS]: {
                type: 'rowgroup[]'
            }
        },
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        type: {
            label: 'Agg Type',
            initialValue: 'sum',
            type: FieldInputType.SELECT,
            params: {
                options: Object.values(AggregatorType)
            }
        },
        column: {
            label: 'Map Column',
            initialValue: columnExpression(''),
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                columns: context.groupColumns ?? context.columns,
                target: 'row'
            })
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            type: FieldInputType.TEXT
        },
    },
    createProcessor(node, params) {
        const columnExpr = node.fields.column as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const type = node.fields.type as AggregatorType;
        const columnMapper = expressions.compileColumnMapper(columnExpr, 'row');
        return new AggregateNodeProcessor(alias, type, columnMapper, params.variables);
    },
    mapContext(node, context): ChartContext {
        const alias = node.fields.alias as string;

        if (context.groupColumns) {
            const columns = pushDistinct(context.columns, alias);
            return {
                groupColumns: context.groupColumns,
                columns
            };

        } else {
            const columns = [alias];
            return {
                columns,
                groupColumns: context.columns
            };
        }
    }
};
