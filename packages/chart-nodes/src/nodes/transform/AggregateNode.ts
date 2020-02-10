import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row, KEY_GROUP } from "../../types/valueTypes";
import { asNumber } from "../../utils/conversions";
import { pushDistinct } from "../../utils/arrayUtils";
import { AggregatorType, createAggregator } from "./aggregators";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

const PORT_GROUPS = 'groups';
const PORT_ROWS = 'rows';

type Config = {
    alias: string;
    aggType: AggregatorType;
    mapColumn: expressions.Mapper
}

class AggregateNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
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

        const rows = value as Row[];
        const result: Row[] = [];
        const aggregator = createAggregator(this.config.aggType);
        let amt: number | undefined;

        for (let i = 0, n = rows.length; i < n; i++) {
            const row = rows[i];
            
            const subRows = row[KEY_GROUP];
            if (subRows) {
                let subAmt: number | undefined = undefined;
                
                for (let j = 0, m = subRows.length; j < m; j++) {
                    const subRow = subRows[j];
                    const ctx = rowToEvalContext(subRow, j, this.params.variables);
                    const value = asNumber(this.config.mapColumn(ctx));
                    subAmt = aggregator(subAmt, value, j);
                }

                result.push({
                    ...row,
                    [this.config.alias]: subAmt,
                    [KEY_GROUP]: subRows
                });
                
            } else {
                const ctx = rowToEvalContext(row, i, this.params.variables);
                const value = asNumber(this.config.mapColumn(ctx));
                amt = aggregator(amt, value, i);
            }
        }

        if (amt != null) {
            result.push({
                [this.config.alias]: amt,
                [KEY_GROUP]: rows
            });
        }
        
        for (const sub of this.subs) {
            sub(result);
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
                type: 'row[]'
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
            type: InputType.SELECT,
            params: {
                options: Object.values(AggregatorType)
            }
        },
        column: {
            label: 'Map Column',
            initialValue: columnExpression(''),
            type: InputType.COLUMN_MAPPER,
            params: {
                target: 'row'
            },
            resolve: {
                compute: ({ context }) => ({
                    columns: context.groupColumns || context.columns
                })
            }
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            type: InputType.TEXT
        },
    },
    createProcessor(node, params) {
        const columnExpr = node.fields.column as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const aggType = node.fields.type as AggregatorType;
        const mapColumn = expressions.compileColumnMapper(columnExpr, 'row');
        return new AggregateNodeProcessor(params, { alias, aggType, mapColumn });
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
