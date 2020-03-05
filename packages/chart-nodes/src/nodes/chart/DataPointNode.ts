import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, Row } from "../../types/valueTypes";
import { asValue, asNumber, asString } from "../../utils/conversions";
import { rowToEvalContext } from "../../utils/expressionUtils";

const FIELD_X = 'x';
const FIELD_Y = 'y';
const FIELD_R = 'r';
const FIELD_BG_COLOR = 'bgColor';
const FIELD_BORDER_COLOR = 'borderColor';

const PORT_IN_ROWS = 'rows';
const PORT_OUT_POINTS = 'points';

type Config = {
    mapX: expressions.Mapper;
    mapY: expressions.Mapper;
    mapR: expressions.Mapper;
    mapBgColor: expressions.Mapper;
    mapBorderColor: expressions.Mapper;
}

class DataPointNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName !== PORT_IN_ROWS) {
            return;
        }

        const rows = inputs[0] as Row[];
        const points: ChartDataPoint[] = rows.map((row, i): ChartDataPoint => {
            const ctx = rowToEvalContext(row, i, null, this.params.variables);

            const x = asValue(this.config.mapX(ctx), 0);
            const y = asValue(this.config.mapY(ctx), 0);
            const r = asNumber(this.config.mapR(ctx));
            const bgColor = asString(this.config.mapBgColor(ctx));
            const borderColor = asString(this.config.mapBorderColor(ctx));
            return { x, y, r, bgColor, borderColor, row };
        });

        this.emitResult(PORT_OUT_POINTS, points);
    }
}

export const DATA_POINT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Points',
    menuGroup: 'Chart',
    description: 'Transforms rows to points for the dataset.',
    ports: {
        in: {
            [PORT_IN_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_OUT_POINTS]: {
                type: 'datapoint[]'
            }
        }
    },
    fields: {
        [FIELD_X]: {
            label: 'Map X',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                target: 'row',
                columns: context.columns
            })
        },
        [FIELD_Y]: {
            label: 'Map Y',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                target: 'row',
                columns: context.columns
            })
        },
        [FIELD_R]: {
            label: 'Map R',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                target: 'row',
                columns: context.columns
            })
        },
        [FIELD_BG_COLOR]: {
            label: 'Map Background Color',
            type: InputType.COLUMN_MAPPER,
            fieldGroup: 'Styling',
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                target: 'row',
                columns: context.columns
            })
        },
        [FIELD_BORDER_COLOR]: {
            label: 'Map Border Color',
            type: InputType.COLUMN_MAPPER,
            fieldGroup: 'Styling',
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                target: 'row',
                columns: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const mapXExpr = node.fields.x as ColumnMapperInputValue;
        const mapYExpr = node.fields.y as ColumnMapperInputValue;
        const mapRExpr = node.fields.r as ColumnMapperInputValue;
        const mapBgColorExpr = node.fields[FIELD_BG_COLOR] as ColumnMapperInputValue;
        const mapBorderColorExpr = node.fields[FIELD_BORDER_COLOR] as ColumnMapperInputValue;


        const mapX = expressions.compileColumnMapper(mapXExpr, 'row');
        const mapY = expressions.compileColumnMapper(mapYExpr, 'row');
        const mapR = expressions.compileColumnMapper(mapRExpr, 'row');
        const mapBgColor = expressions.compileColumnMapper(mapBgColorExpr, 'row');
        const mapBorderColor = expressions.compileColumnMapper(mapBorderColorExpr, 'row');

        return new DataPointNodeProcessor(params, { mapX, mapY, mapR, mapBgColor, mapBorderColor });
    }
};
