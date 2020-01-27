import { GraphNodeConfig, FieldInputType, Entry, expressionUtils, GraphNode } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ChartDataSet, ChartAxisConfig, ChartViewConfig, ChartEventType, ViewType } from "../../types/valueTypes";

function getDefaultViewName(node: GraphNode) {
    return 'chart-' + node.id;
}

export const CHART_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart',
    menuGroup: 'Chart',
    description: 'Displays the data as a chart.',
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
            onClick: {
                type: 'row'
            }
        }
    },
    fields: {
        name: {
            label: 'Name',
            type: FieldInputType.TEXT,
            initialValue: ''
        },
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
    createProcessor({ next, node, params: { variables, renderView } }) {
        const type = node.fields.type as string;
        const paramInputs = node.fields.params as Entry<string>[];
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);

        let viewName = node.fields.name as string;
        if (!viewName) {
            viewName = getDefaultViewName(node);
        }

        return {
            onNext(inputs) {
                const dataSets = (inputs.datasets as ChartDataSet[][]).flat();
                const xAxes = inputs.xAxes as ChartAxisConfig[];
                const yAxes = inputs.yAxes as ChartAxisConfig[];
                const params = mapParams(variables);

                const chart: ChartViewConfig = {
                    viewType: ViewType.CHART,
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

                                next('onClick', datum.row);
                            }
                        }
                    ]
                };

                if (renderView) {
                    renderView(viewName, chart);
                }
            }
        }
    }
};
