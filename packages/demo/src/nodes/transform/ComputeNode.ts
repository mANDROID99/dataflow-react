import { FieldInputType, GraphNodeConfig, columnExpression, ColumnMapperInputValue, expressionUtils } from '@react-ngraph/core';
import { ChartContext, ChartParams } from '../../chartContext';
import { pushDistinct } from '../../utils/arrayUtils';
import { Row, EMPTY_ROWS, Rows, createRows } from '../../types/valueTypes';
import { rowToEvalContext } from '../../utils/expressionUtils';

export const COMPUTE_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Compute',
    menuGroup: 'Transform',
    description: 'Computes a value for each row.',
    ports: {
        in: {
            rows: {
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
    createProcessor({ next, node, params }) {
        const alias = node.fields.alias as string;
        const mapValueExpr = node.fields.value as ColumnMapperInputValue;
        const mapValue = expressionUtils.compileColumnMapper(mapValueExpr, 'row');

        return {
            onNext(inputs) {
                const r = (inputs.rows[0] || EMPTY_ROWS) as Rows;
                const rows: Row[] = r.rows.map((row, i) => {
                    const newRow: Row = Object.assign({}, row);
                    
                    if (mapValueExpr) {
                        const ctx = rowToEvalContext(row, i, params.variables);
                        newRow[alias] = mapValue(ctx);
                    }
    
                    return newRow;
                });
    
                next('out', createRows(rows));
            }
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
