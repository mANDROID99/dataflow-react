import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row } from "../../types/valueTypes";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

const PORT_ROWS = 'rows';

class SortByNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly desc: boolean,
        private readonly columnKeyMapper: expressions.Mapper,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.SORT_BY;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        if (!this.subs.length) return;

        const rows = value as Row[];
        const rowsSorted = rows.slice(0);

        rowsSorted.sort((a, b) => {
            const sortKeyA = this.columnKeyMapper(rowToEvalContext(a, null, this.context)) as any;
            const sortKeyB = this.columnKeyMapper(rowToEvalContext(b, null, this.context)) as any;
          
            if (sortKeyB > sortKeyA) {
                return this.desc ? 1 : -1;

            } else if (sortKeyB < sortKeyA) {
                return this.desc ? -1 : 1;

            } else {
                return 0;
            }
        });

        for (const sub of this.subs) {
            sub(rowsSorted);
        };  
    }
}

export const SORT_BY_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Sort By',
    menuGroup: 'Transform',
    description: 'Sorts the rows by a key.',
    ports: {
        in: {
            [PORT_ROWS]: {
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
        column: {
            label: 'Map Column Key',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                columns: context.columns,
                target: 'row'
            })
        },
        desc: {
            label: 'Descending',
            type: FieldInputType.CHECK,
            initialValue: false
        }
    },
    createProcessor(node, params) {
        const desc = node.fields.desc as boolean;
        const mapColumnKeyExpr = node.fields.column as ColumnMapperInputValue;
        const columnKeyMapper = expressions.compileColumnMapper(mapColumnKeyExpr, 'row');
        return new SortByNodeProcessor(desc, columnKeyMapper, params.variables);
    }
}

