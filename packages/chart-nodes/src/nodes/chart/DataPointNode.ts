import { GraphNodeConfig, BaseNodeProcessor, NodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";
import { zipObjKeys, groupBy } from "../../utils/arrayUtils";

const PORT_IN_X = 'x';
const PORT_IN_Y = 'y';
const PORT_IN_R = 'r';
const PORT_IN_COLOR = 'color';
const PORT_IN_SERIES_KEY = 'series';

const PORT_OUT_POINTS = 'points';
const PORT_OUT_SERIES_KEYS = 'keys';

class DataPointNodeProcessor extends BaseNodeProcessor {
    private xValues?: unknown[];
    private yValues?: unknown[];
    private rValues?: unknown[];
    private colorValues?: unknown[];
    private seriesValues?: unknown[];
    private readonly awaiting = new Set<string>();

    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor): number {
        this.awaiting.add(portIn);
        return super.registerConnectionInverse(portOut, portIn, processor);
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_X) {
            this.xValues = inputs[0] as unknown[];

        } else if (portName === PORT_IN_Y) {
            this.yValues = inputs[0] as unknown[];

        } else if (portName === PORT_IN_R) {
            this.rValues = inputs[0] as unknown[];

        } else if (portName === PORT_IN_COLOR) {
            this.colorValues = inputs[0] as unknown[];

        } else if (portName === PORT_IN_SERIES_KEY) {
            this.seriesValues = inputs[0] as unknown[];
        }

        this.awaiting.delete(portName);
        if (!this.awaiting.size) {
            this.update();
        }
    }

    private update() {
        const points = zipObjKeys<ChartDataPoint>({
            x: this.xValues,
            y: this.yValues,
            r: this.rValues,
            color: this.colorValues,
            seriesKey: this.seriesValues
        });

        const groups = groupBy(points, (point) => asString(point.seriesKey));
        const pointsGrouped: ChartDataPoint[][] = [];
        const keys: string[] = [];
        for (const e of groups.entries()) {
            keys.push(e[0]);
            pointsGrouped.push(e[1]);
        }

        this.emitResult(PORT_OUT_POINTS, pointsGrouped);
        this.emitResult(PORT_OUT_SERIES_KEYS, keys);
    }
}

export const DATA_POINT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Points',
    menuGroup: 'Chart',
    description: 'Transforms rows to points for the dataset.',
    ports: {
        in: {
            [PORT_IN_X]: {
                type: 'value[]'
            },
            [PORT_IN_Y]: {
                type: 'value[]'
            },
            [PORT_IN_R]: {
                type: 'value[]'
            },
            [PORT_IN_COLOR]: {
                type: 'value[]'
            },
            [PORT_IN_SERIES_KEY]: {
                type: 'value[]'
            }
        },
        out: {
            [PORT_OUT_POINTS]: {
                type: 'datapoint[]'
            },
            [PORT_OUT_SERIES_KEYS]: {
                type: 'value[]'
            }
        }
    },
    fields: {},
    createProcessor() {
        return new DataPointNodeProcessor();
    }
};
