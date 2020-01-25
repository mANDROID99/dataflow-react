import { GraphNodeConfig, FieldInputType, Entry, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ChartDataSet, ChartAxisConfig, ChartConfig, ChartEventType } from "../../types/valueTypes";

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
        out: {
            selection: {
                type: 'row[]'
            }
        }
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
    createProcessor({ next, node, params: { variables, renderChart } }) {
        const type = node.fields.type as string;
        const paramInputs = node.fields.params as Entry<string>[];
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);
        const id = 'chart-id';

        return {
            onNext(inputs) {
                const dataSets = (inputs.datasets as ChartDataSet[][]).flat();
                const xAxes = inputs.xAxes as ChartAxisConfig[];
                const yAxes = inputs.yAxes as ChartAxisConfig[];
                const params = mapParams(variables);

                const chart: ChartConfig = {
                    type,
                    dataSets,
                    xAxes,
                    yAxes,
                    params,
                    events: [
                        {
                            type: ChartEventType.CLICK,
                            action: (datasetIndex, index) => {
                                const ds = dataSets[datasetIndex];
                                if (!ds) return;

                                const datum = ds.data[index];
                                if (!datum) return;

                                next('selection', [datum.row]);
                            }
                        }
                    ]
                };

                if (renderChart) {
                    renderChart(id, chart);
                }
            }
        }
    }
};
