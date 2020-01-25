import { FieldInputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressionUtils } from '@react-ngraph/core';
import { ChartContext, ChartParams } from '../../chartContext';
import { pushDistinct } from '../../utils/arrayUtils';
import { Row } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';

export const COMPUTE_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Compute',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                type: 'row[]'
            }
        },
        out: {
            out: {
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
    createProcessor({ node, params }) {
        const alias = node.fields.alias as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;
        const mapValue = expressionUtils.compileColumnMapper(mapValueExpr, 'row');

        return (inputs, next) => {
            const allRows = inputs.in as Row[][];
            const rows = allRows[0] ?? [];

            const result: Row[] = rows.map((row, i) => {
                const values = Object.assign({}, row.values);
                
                if (mapValueExpr) {
                    const ctx = rowToEvalContext(row, i, params.variables);
                    values[alias] = mapValue(ctx);
                }

                return { ...row, values };
            });

            next('out', result);
        };
    },
    mapContext({ node, context }) {
        const alias = node.fields.alias as string;
        const columns = pushDistinct(context.columns, alias);
        return {
            ...context,
            columns
        };
    }
};
