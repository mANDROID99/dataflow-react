import { InputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressions, BaseNodeProcessor } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { pushDistinct } from '../../utils/arrayUtils';
import { Row } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';

const PORT_ROWS = 'rows';
const KEY_ACC = 'acc';

type Config = {
    alias: string;
    reduce: boolean;
    seed: unknown;
    mapValue: expressions.Mapper;
}

class ComputeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }
    
    process(portName: string, values: unknown[]) {
        if (portName !== PORT_ROWS) {
            return;
        }

        const rows = values[0] as Row[];

        const nextRows: Row[] = this.config.reduce
            ? this.reduceRows(rows)
            : this.mapRows(rows);

        this.emitResult(PORT_ROWS, nextRows);
    }

    private reduceRows(rows: Row[]) {
        const config = this.config;
        const alias = config.alias;
        const mapValue = config.mapValue;

        let value = config.seed;
        for (let i = 0, n = rows.length; i < n; i++) {
            const ctx = rowToEvalContext(rows[i], i, null, this.params.variables);
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
            const ctx = rowToEvalContext(row, i, null, this.params.variables);
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
            params: ({ context }) => ({
                target: 'row',
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
            initialValue: ''
        }
    },
    mapContext({ node, context }){
        const alias = node.fields.alias as string;
        const columns = pushDistinct(context.columns, alias);
        return {
            ...context,
            columns
        };
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const reduce = node.fields.reduce as boolean;
        const seedExpr = node.fields.seed as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;

        const mapValue = expressions.compileColumnMapper(mapValueExpr, 'row');
        const seed = expressions.compileExpression(seedExpr)(params.variables);

        return new ComputeProcessor(params, { alias, reduce, seed, mapValue });
    }
};
