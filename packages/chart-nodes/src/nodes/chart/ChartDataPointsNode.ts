import { BaseNodeProcessor, GraphNodeConfig } from "@react-ngraph/core";
import { ChartPointConfig, ChartPointsConfig } from "../../types/chartValueTypes";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ColumnMapperInputValue, InputType } from "../../types/inputTypes";
import { Row } from "../../types/valueTypes";
import { compileColumnMapper } from "../../utils/columnMapperUtils";
import { asString } from '../../utils/conversions';
import { Mapper, rowToEvalContext } from "../../utils/expressionUtils";
import { ColorScheme } from "../styling/ColorSchemeNode";

const PORT_IN_ROWS = 'rows';
const PORT_IN_COLOR_SCHEME = 'color-scheme';
const PORT_OUT_POINTS = 'points';

const FIELD_X = 'x';
const FIELD_Y = 'y';
const FIELD_R = 'r';
const FIELD_SERIES_KEY = 'series';
const FIELD_BG_COLOR = 'bgColor';
const FIELD_BORDER_COLOR = 'borderColor';

type Config = {
    mapX: Mapper;
    mapY: Mapper;
    mapR: Mapper;
    mapSeries: Mapper;
    mapBgColor: Mapper;
    mapBorderColor: Mapper;
}

class ChartDataPointsNodeProcessor extends BaseNodeProcessor {
    private rows?: Row[];
    private colorScheme?: ColorScheme;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_ROWS) {
            this.rows = inputs[0] as Row[];

        } else if (portName === PORT_IN_COLOR_SCHEME) {
            this.colorScheme = inputs[0] as ColorScheme;
        }

        if (this.isReady()) {
            this.update();
        }
    }

    private update() {
        const rows = this.rows;
        if (!rows) return;

        const colorScheme = this.colorScheme;
        const config = this.config;
        const output: ChartPointsConfig[] = [];
        const lookup = new Map<string | null, ChartPointsConfig>();

        for (let i = 0, n = rows.length; i < n; i++) {
            const row = rows[i];
            const context = rowToEvalContext(row, i, null, this.params.variables);

            // map point attributes
            const x = config.mapX(context);
            const y = config.mapY(context);
            const r = config.mapR(context);
            const seriesKey = asString(config.mapSeries(context)) || null;
            let bgColor = asString(config.mapBgColor(context)) || undefined;
            let borderColor = asString(config.mapBorderColor(context)) || undefined;

            // apply the color-scheme
            if (bgColor == null && colorScheme) {
                bgColor = colorScheme.getColorAt(i, n);
            }

            const point: ChartPointConfig = {
                x, y, r, bgColor, borderColor, row
            };

            // group points by series-key
            let points: ChartPointsConfig | undefined = lookup.get(seriesKey);
            if (points) {
                points.points.push(point);

            } else {
                points = {
                    points: [point],
                    row
                };

                output.push(points);
                lookup.set(seriesKey, points);
            }
        }

        this.emitResult(PORT_OUT_POINTS, output);
    }
}

export const CHART_DATA_POINTS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart Points' ,
    menuGroup: 'Chart',
    description: 'Maps the points of the chart',
    width: 200,
    ports: {
        in: {
            [PORT_IN_ROWS]: {
                type: 'row[]'
            },
            [PORT_IN_COLOR_SCHEME]: {
                type: 'color-scheme'
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
            initialValue: '',
            params: ({ context }) => ({
                columns: context.columns
            })
        },
        [FIELD_Y]: {
            label: 'Map Y',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                columns: context.columns
            })
        },
        [FIELD_R]: {
            label: 'Map R',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_SERIES_KEY]: {
            label: 'Series Key',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_BG_COLOR]: {
            label: 'Background Color',
            fieldGroup: 'Styling',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_BORDER_COLOR]: {
            label: 'Border Color',
            fieldGroup: 'Styling',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const mapX = compileColumnMapper(node.fields[FIELD_X] as ColumnMapperInputValue);
        const mapY = compileColumnMapper(node.fields[FIELD_Y] as ColumnMapperInputValue);
        const mapR = compileColumnMapper(node.fields[FIELD_R] as ColumnMapperInputValue);
        const mapSeries = compileColumnMapper(node.fields[FIELD_SERIES_KEY] as ColumnMapperInputValue);
        const mapBgColor = compileColumnMapper(node.fields[FIELD_BG_COLOR] as ColumnMapperInputValue);
        const mapBorderColor = compileColumnMapper(node.fields[FIELD_BORDER_COLOR] as ColumnMapperInputValue);

        return new ChartDataPointsNodeProcessor(params, {
            mapX,
            mapY,
            mapR,
            mapSeries,
            mapBgColor,
            mapBorderColor
        });
    }
};
