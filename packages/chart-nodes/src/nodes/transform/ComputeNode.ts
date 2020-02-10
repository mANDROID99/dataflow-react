import { InputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { pushDistinct } from '../../utils/arrayUtils';
import { Row } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';
import { NodeType } from '../nodes';

const PORT_ROWS = 'rows';

type Config = {
    alias: string;
    mapValue: expressions.Mapper | undefined;
}

class ComputeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
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
            
            if (this.config.mapValue) {
                const ctx = rowToEvalContext(row, i, this.params.variables);
                newRow[this.config.alias] = this.config.mapValue(ctx);
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
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                target: 'row'
            },
            resolve: ({ context }) => ({
                columns: context.columns
            })
        },
        alias: {
            label: 'Alias',
            type: InputType.TEXT,
            initialValue: ''
        }
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;
        const mapValue = expressions.compileColumnMapper(mapValueExpr, 'row');
        return new ComputeProcessor(params, { alias, mapValue });
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
