import { GraphNodeConfig, FieldInputType, Entry, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { DataSet, AxisConfig, ChartConfig } from "../../types/nodeTypes";

export const CHART_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart',
    menuGroup: 'Chart',
    ports: {
        in: {
            datasets: {
                type: 'dataset[]',
                multi: true
            },
            xAxes: {
                type: 'axis',
                multi: true
            },
            yAxes: {
                type: 'axis',
                multi: true
            }
        },
        out: {}
    },
    fields: {
        type: {
            label: 'Type',
            type: FieldInputType.SELECT,
            initialValue: 'line',
            params: {
                options: [
                    'line',
                    'bar',
                    'radar',
                    'pie',
                    'doughnut',
                    'polarArea',
                    'bubble',
                    'scatter'
                ]
            }
        },
        params: {
            label: 'Params',
            type: FieldInputType.DATA_ENTRIES,
            initialValue: []
        }
    },
    createProcessor({ node, params: { variables } }) {
        const type = node.fields.type as string;
        const paramInputs = node.fields.params as Entry<string>[];
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);

        return (inputs, next) => {
            const dataSets = inputs.datasets as DataSet[][];
            const xAxes = inputs.xAxes as AxisConfig[];
            const yAxes = inputs.yAxes as AxisConfig[];
            const params = mapParams(variables);

            const chart: ChartConfig = {
                type,
                dataSets: dataSets.flat(),
                xAxes,
                yAxes,
                params
            };

            next('out', chart);
        };
    }
};
