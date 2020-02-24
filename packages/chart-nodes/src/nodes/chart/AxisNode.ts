import { GraphNodeConfig, InputType, Entry, expressions, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { AxisType, ChartAxisConfig } from "../../types/valueTypes";

const PORT_AXIS = 'axis';

type Config = {
    label: string;
    axisType: AxisType;
    params: Entry<unknown>[];
}

class AxisNodeProcessor extends BaseNodeProcessor {
    constructor(private readonly config: Config) {
        super();
    }

    start() {
        const axis: ChartAxisConfig = {
            type: this.config.axisType,
            label: this.config.label,
            params: this.config.params
        };
        
        this.emitResult(PORT_AXIS, axis);
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
