import { GraphNodeConfig, InputType, Entry, NodeProcessor, expressions } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { AxisType, ChartAxisConfig } from "../../types/valueTypes";
import { NodeType } from "../nodes";

const PORT_AXIS = 'axis';

type Config = {
    label: string;
    axisType: AxisType;
    params: Entry<unknown>[];
}

class AxisNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(private readonly config: Config) { }

    get type(): string {
        return NodeType.AXIS;
    }

    register() { }

    subscribe(port: string, sub: (value: unknown) => void): void {
        if (port === PORT_AXIS) {
            this.subs.push(sub);
        }
    }

    start() {
        if (!this.subs.length) {
            return;
        }

        const axis: ChartAxisConfig = {
            type: this.config.axisType,
            label: this.config.label,
            params: this.config.params
        };
        
        for (const sub of this.subs) {
            sub(axis);
        }
    }
}

export const AXIS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Axis',
    menuGroup: 'Chart',
    description: 'Constructs an axis for the chart.',
    ports: {
        in: {},
        out: {
            [PORT_AXIS]: {
                type: 'axis'
            }
        }
    },
    fields: {
        type: {
            label: 'Type',
            type: InputType.SELECT,
            initialValue: 'linear',
            params: {
                options: [
                    'category',
                    'linear',
                    'logarithmic',
                    'time'
                ]
            }
        },
        label: {
            label: 'Label',
            type: InputType.TEXT,
            initialValue: ''
        },
        params: {
            label: 'Params',
            type: InputType.DATA_ENTRIES,
            initialValue: [
                { key: 'ticks.beginAtZero', value: 'true' }
            ]
        }
    },
    createProcessor(node, params) {
        const axisType = node.fields.type as AxisType;
        const label = node.fields.label as string;
        const paramExprs = node.fields.params as Entry<string>[];
        const paramsMapper = expressions.compileEntriesMapper(paramExprs);
        const paramsMapped = paramsMapper(params.variables);
        
        return new AxisNodeProcessor({
            axisType,
            label,
            params: paramsMapped
        });
    }
};
