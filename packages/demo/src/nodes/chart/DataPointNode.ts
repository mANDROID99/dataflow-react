import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/editor";

import { ChartContext, ChartParams } from "../../chartContext";
import { Row, DataPoint } from "../../types/nodeTypes";
import { asValue, asNumber, asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const DATA_POINT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Points',
    menuGroup: 'Chart',
    ports: {
        in: {
            rows: {
                type: 'row[]'
            }
        },
        out: {
            points: {
                type: 'datapoint[]'
            }
        }
    },
    fields: {
        x: {
            label: 'Map X',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                columns: context.columns,
                target: 'row'
            })
        },
        y: {
            label: 'Map Y',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                columns: context.columns,
                target: 'row'
            })
        },
        r: {
            label: 'Map R',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        color: {
            label: 'Map Color',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        }
    },
    createProcessor({ node, params }) {
        const mapXExpr = node.fields.x as ColumnMapperInputValue;
        const mapYExpr = node.fields.y as ColumnMapperInputValue;
        const mapRExpr = node.fields.r as ColumnMapperInputValue;
        const mapColorExpr = node.fields.color as ColumnMapperInputValue;

        const mapX = expressionUtils.compileColumnMapper(mapXExpr, 'row');
        const mapY = expressionUtils.compileColumnMapper(mapYExpr, 'row');
        const mapR = expressionUtils.compileColumnMapper(mapRExpr, 'row');
        const mapColor = expressionUtils.compileColumnMapper(mapColorExpr, 'row');

        return (input, next) => {
            const allRows = input.rows as Row[][];
            const rows: Row[] = allRows[0] ?? [];

            const points: DataPoint[] = rows.map((row, i): DataPoint => {
                const ctx = rowToEvalContext(row, i, params.variables);
                const x = asValue(mapX(ctx), 0);
                const y = asValue(mapY(ctx), 0);
                const r = asNumber(mapR(ctx));
                const color = asString(mapColor(ctx));
                return { x, y, r, color, row }
            });

            next('points', points);
        };
    }
}
