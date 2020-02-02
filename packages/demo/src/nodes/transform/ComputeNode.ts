import { FieldInputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from '@react-ngraph/core';
import { ChartContext, ChartParams } from '../../chartContext';
import { pushDistinct } from '../../utils/arrayUtils';
import { Row } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';
import { NodeType } from '../nodes';

const PORT_ROWS = 'rows';

class ComputeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly alias: string,
        private readonly valueMapper: expressions.Mapper | undefined,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.COMPUTE;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this))
        }
    }

    subscribe(port: string, sub: (value: unknown) => void): void {
        if (port === PORT_ROWS) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        if (!this.subs.length) return;
        const rows = value as Row[];

        const rowsMapped: Row[] = rows.map((row, i) => {
            const newRow: Row = Object.assign({}, row);
            
            if (this.valueMapper) {
                const ctx = rowToEvalContext(row, i, this.context);
                newRow[this.alias] = this.valueMapper(ctx);
            }

            return newRow;
        });

        for (const sub of this.subs) {
            sub(rowsMapped);
        }
    }
}

export const COMPUTE_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Compute',
    menuGroup: 'Transform',
    description: 'Computes a value for each row.',
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
        value: {
            label: 'Map Value',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                columns: context.columns,
                target: 'row'
            })
        },
        alias: {
            label: 'Alias',
            type: FieldInputType.TEXT,
            initialValue: ''
        }
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;
        const valueMapper = expressions.compileColumnMapper(mapValueExpr, 'row');
        return new ComputeProcessor(alias, valueMapper, params.variables);
    },
    mapContext(node, context) {
        const alias = node.fields.alias as string;
        const columns = pushDistinct(context.columns, alias);
        return {
            ...context,
            columns
        };
    }
};
