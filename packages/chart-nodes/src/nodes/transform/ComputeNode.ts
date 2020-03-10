import { BaseNodeProcessor, GraphNodeConfig, InputType as CoreInputType } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ColumnMapperInputValue, ColumnMapperType, InputType } from '../../types/inputTypes';
import { Row } from '../../types/valueTypes';
import { pushDistinct } from '../../utils/arrayUtils';
import { compileColumnMapper } from '../../utils/columnMapperUtils';
import { compileExpression, Mapper, rowToEvalContext } from '../../utils/expressionUtils';

const PORT_ROWS = 'rows';
const KEY_ACC = 'acc';

type Config = {
    alias: string;
    reduce: boolean;
    seed: unknown;
    mapValue: Mapper;
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
            type: CoreInputType.TEXT,
            initialValue: ''
        },
        value: {
            label: 'Map Value',
            type: InputType.COLUMN_MAPPER,
            initialValue: {
                type: ColumnMapperType.EXPRESSION,
                value: ''
            },
            params: ({ context }) => ({
                columns: context.columns
            })
        },
        reduce: {
            label: 'Reduce',
            fieldGroup: "Reduce",
            type: CoreInputType.CHECK,
            initialValue: false
        },
        seed: {
            label: 'Seed',
            fieldGroup: "Reduce",
            type: CoreInputType.TEXT,
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

        const mapValue = compileColumnMapper(mapValueExpr);
        const seed = compileExpression(seedExpr)(params.variables);

        return new ComputeProcessor(params, { alias, reduce, seed, mapValue });
    }
};
