import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row, Rows, EMPTY_ROWS, createRows } from "../../types/valueTypes";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const SORT_BY_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Sort By',
    menuGroup: 'Transform',
    description: 'Sorts the rows by a key.',
    ports: {
        in: {
            rows: {
                type: 'row[]'
            }
        },
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Map Column',
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
    createProcessor({ next, node, params }) {
        const mapColumnExpr = node.fields.column as ColumnMapperInputValue;
        const desc = node.fields.desc as boolean;
        const mapColumn = expressionUtils.compileColumnMapper(mapColumnExpr, 'row');

        return {
            onNext(inputs) {
                const r = (inputs.rows[0] || EMPTY_ROWS) as Rows;
                const rowsSorted = r.rows.slice(0);
    
                rowsSorted.sort((a, b) => {
                    const sortKeyA = mapColumn(rowToEvalContext(a, null, params.variables)) as any;
                    const sortKeyB = mapColumn(rowToEvalContext(b, null, params.variables)) as any;
                  
                    if (sortKeyB > sortKeyA) {
                        return desc ? 1 : -1;
    
                    } else if (sortKeyB < sortKeyA) {
                        return desc ? -1 : 1;
    
                    } else {
                        return 0;
                    }
                });
    
                next('rows', createRows(rowsSorted));
            }
        };
    }
}

