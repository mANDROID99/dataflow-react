import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/editor";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row } from "../../types/nodeTypes";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const SORT_BY_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Sort By',
    menuGroup: 'Transform',
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
    createProcessor({ node, params }) {
        const mapColumnExpr = node.fields.column as ColumnMapperInputValue;
        const desc = node.fields.desc as boolean;
        const mapColumn = expressionUtils.compileColumnMapper(mapColumnExpr, 'row');

        return (inputs, next) => {
            const rows = (inputs.rows as Row[][])[0] ?? [];
            const rowsSorted = rows.slice(0);

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

            next('rows', rowsSorted);
        }
    }
}

