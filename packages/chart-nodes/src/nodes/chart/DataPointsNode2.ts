import { GraphNodeConfig, InputType, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, Row, ChartDataSetPoints } from "../../types/valueTypes";
import { asString } from '../../utils/conversions';

const PORT_IN_ROWS = 'rows';
const PORT_OUT_POINTS = 'points';

const FIELD_X = 'x';
const FIELD_Y = 'y';
const FIELD_R = 'r';
const FIELD_SERIES_KEY = 'series';
const FIELD_BG_COLOR = 'bgColor';
const FIELD_BORDER_COLOR = 'borderColor';

type Config = {
    keyX: string;
    keyY: string;
    keyR: string;
    keySeries: string;
    keyBgColor: string;
    keyBorderColor: string;
}

class DataPointsNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_ROWS) {

            const rows = inputs[0] as Row[];
            const config = this.config;

            const output: ChartDataSetPoints[] = [];
            const lookup = new Map<string | null, ChartDataSetPoints>();

            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];
                const x = row[config.keyX];
                const y = row[config.keyY];
                const r = row[config.keyR];
                const bgColor = row[config.keyBgColor];
                const borderColor = row[config.keyBorderColor];
                const series = row[config.keySeries];
                const point: ChartDataPoint = { x, y, r, bgColor, borderColor };

                const seriesKey = asString(series, null);
                let points: ChartDataSetPoints | undefined = lookup.get(seriesKey);

                if (points) {
                    points.points.push(point);

                } else {
                    points = {
                        seriesKey,
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
}


export const CHART_DATA_POINTS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart Data-Points' ,
    menuGroup: 'Chart',
    description: 'Constructs datasets (series) for the chart.',
    width: 200,
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
            label: 'X',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                options: context.columns
            })
        },
        [FIELD_Y]: {
            label: 'Y',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                options: context.columns
            })
        },
        [FIELD_R]: {
            label: 'R',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                options: context.columns
            })
        },
        [FIELD_SERIES_KEY]: {
            label: 'Series Key',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                options: context.columns
            })
        },
        [FIELD_BG_COLOR]: {
            label: 'Background Color',
            fieldGroup: 'Styling',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                options: context.columns
            })
        },
        [FIELD_BORDER_COLOR]: {
            label: 'Border Color',
            fieldGroup: 'Styling',
            type: InputType.SELECT,
            initialValue: '',
            params: ({ context }) => ({
                optional: true,
                options: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const keyX = node.fields[FIELD_X] as string;
        const keyY = node.fields[FIELD_Y] as string;
        const keyR = node.fields[FIELD_R] as string;
        const keySeries = node.fields[FIELD_SERIES_KEY] as string;
        const keyBgColor = node.fields[FIELD_BG_COLOR] as string;
        const keyBorderColor = node.fields[FIELD_BORDER_COLOR] as string;

        return new DataPointsNodeProcessor({
            keyX,
            keyY,
            keyR,
            keySeries,
            keyBgColor,
            keyBorderColor
        });
    }
};
