import { InputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { pushDistinct } from '../../utils/arrayUtils';
import { Row } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';
import { NodeType } from '../nodes';

const PORT_ROWS = 'rows';
const KEY_ACC = 'acc';

type Config = {
    alias: string;
    reduce: boolean;
    seed: unknown;
    mapValue: expressions.Mapper;
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
        if (!this.subs.length) {
            return;
        }

        const rows = value as Row[];
        const nextRows: Row[] = this.config.reduce
            ? this.reduceRows(rows)
            : this.mapRows(rows);

        for (const sub of this.subs) {
            sub(nextRows);
        }
    }

    private reduceRows(rows: Row[]) {
        const config = this.config;
        const alias = config.alias;
        const mapValue = config.mapValue;

        let value = config.seed;
        for (let i = 0, n = rows.length; i < n; i++) {
            const ctx = rowToEvalContext(rows[i], i, this.params.variables);
            ctx[KEY_ACC] = value;
            value = mapValue(ctx);
        }

        return rows.map((row) => ({ ...row, [alias]: value }));
    }

    private mapRows(rows: Row[]) {
        const config = this.config;
        const alias = config.alias;
        const mapValue = config.mapValue;

        return rows.map((row, i) => {
            const ctx = rowToEvalContext(row, i, this.params.variables);
            const value = mapValue(ctx);
            return { ...row, [alias]: value };
        })
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
        alias: {
            label: 'Alias',
            type: InputType.TEXT,
            initialValue: ''
        },
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
        reduce: {
            label: 'Reduce',
            type: InputType.CHECK,
            initialValue: false
        },
        seed: {
            label: 'Seed',
            type: InputType.TEXT,
            initialValue: '',
            resolve: ({ fields }) => ({
                hidden: !fields.reduce
            })
        }
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const reduce = node.fields.reduce as boolean;
        const seedExpr = node.fields.seed as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;

        const mapValue = expressions.compileColumnMapper(mapValueExpr, 'row');
        const seed = expressions.compileExpression(seedExpr)(params.variables);

        return new ComputeProcessor(params, { alias, reduce, seed, mapValue });
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
