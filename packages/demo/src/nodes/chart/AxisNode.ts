import { GraphNodeConfig, FieldInputType, Entry, expressionUtils } from "@react-ngraph/editor";
import { ChartContext, ChartParams } from "../../chartContext";
import { AxisType, AxisConfig } from "../../types/nodeTypes";

export const AXIS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Axis',
    menuGroup: 'Chart',
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
    createProcessor({ node, params: { variables } }) {
        const type = node.fields.type as AxisType;
        const label = node.fields.label as string;
        const paramInputs = node.fields.params as Entry<string>[];
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);

        return (inputs, next) => {
            const params = mapParams(variables);
            const axis: AxisConfig = {
                type,
                label,
                params
            };
            
            next('axis', axis);
        };
    }
};
