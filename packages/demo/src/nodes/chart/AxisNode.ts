import { GraphNodeConfig, FieldInputType, Entry, NodeProcessor, expressions } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { AxisType, ChartAxisConfig } from "../../types/valueTypes";
import { NodeType } from "../nodes";

const PORT_AXIS = 'axis';

class AxisNodeProcessor implements NodeProcessor {
    private sub?: (value: unknown) => void;

    constructor(
        private readonly axisType: AxisType,
        private readonly label: string,
        private readonly params: Entry<unknown>[]
    ) { }

    get type(): string {
        return NodeType.AXIS;
    }

    registerProcessor() { }

    subscribe(port: string, sub: (value: unknown) => void): void {
        if (port === PORT_AXIS) {
            this.sub = sub;
        }
    }

    onStart() {
        if (!this.sub) {
            return;
        }

        const axis: ChartAxisConfig = {
            type: this.axisType,
            label: this.label,
            params: this.params
        };
        
        this.sub(axis);
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
            type: FieldInputType.SELECT,
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
            type: FieldInputType.TEXT,
            initialValue: ''
        },
        params: {
            label: 'Params',
            type: FieldInputType.DATA_ENTRIES,
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
        return new AxisNodeProcessor(axisType, label, paramsMapped);
    }
};
