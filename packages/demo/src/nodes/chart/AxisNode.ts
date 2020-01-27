import { GraphNodeConfig, FieldInputType, Entry, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { AxisType, ChartAxisConfig } from "../../types/valueTypes";

export const AXIS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Axis',
    menuGroup: 'Chart',
    description: 'Constructs a chart axis.',
    ports: {
        in: {},
        out: {
            axis: {
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
    createProcessor({ next, node, params: { variables } }) {
        const type = node.fields.type as AxisType;
        const label = node.fields.label as string;
        const paramInputs = node.fields.params as Entry<string>[];
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);

        return {
            onStart() {
                const params = mapParams(variables);
                const axis: ChartAxisConfig = {
                    type,
                    label,
                    params
                };
                
                next('axis', axis);
            }
        };
    }
};
