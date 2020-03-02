import { GraphNodeConfig, InputType, Entry, expressions, GraphNode, BaseNodeProcessor, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataSet, ChartAxisConfig, ChartViewConfig, ChartEventType, ViewType, ChartEventConfig } from "../../types/valueTypes";

function getDefaultViewName(node: GraphNode) {
    return 'chart-' + node.id;
}

const PORT_DATASETS = 'datasets';
const PORT_X_AXES = 'xAxes';
const PORT_Y_AXES = 'yAxes';
const PORT_ON_CLICK = 'onClick';

type Config = {
    chartType: string;
    chartParams: Entry<unknown>[];
}

class ChartViewProcessor extends BaseNodeProcessor {
    private datasets?: ChartDataSet[][];
    private xAxes?: ChartAxisConfig[];
    private yAxes?: ChartAxisConfig[];

    constructor(
        private readonly params: ChartParams,
        private readonly viewName: string,
        private readonly config: Config
    ) {
        super();
        this.datasets = [];
        this.xAxes = [];
        this.yAxes = [];
    }

    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor) {
        if (portIn === PORT_DATASETS) {
            this.datasets = undefined;
        } else if (portIn === PORT_X_AXES) {
            this.xAxes = undefined;
        } else if (portIn === PORT_Y_AXES) {
            this.yAxes = undefined;
        }
        return super.registerConnectionInverse(portOut, portIn, processor);
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_DATASETS) {
            this.datasets = inputs as ChartDataSet[][];
            this.update();

        } else if (portName === PORT_X_AXES) {
            this.xAxes = inputs as ChartAxisConfig[];
            this.update();

        } else if (portName === PORT_Y_AXES) {
            this.yAxes = inputs as ChartAxisConfig[];
            this.update();
        }
    }

    private update() {
        if (!this.datasets || !this.xAxes || !this.yAxes) {
            return;
        }

        const datasets = this.datasets.flat();
        const events: ChartEventConfig[] = [];
        
        // setup on-click handler
        events.push({
            type: ChartEventType.CLICK,
            action: (datasetIndex, index) => {
                const ds = datasets[datasetIndex];
                if (!ds) return;

                const datum = ds.data[index];
                if (!datum) return;

                this.emitResult(PORT_ON_CLICK, [datum.row]);
            }
        })

        // chart config
        const chart: ChartViewConfig = {
            type: ViewType.CHART,
            chartType: this.config.chartType,
            datasets: datasets,
            xAxes: this.xAxes,
            yAxes: this.yAxes,
            params: this.config.chartParams,
            events
        };

        // show the chart preview
        this.params.actions.renderView?.(this.viewName, chart);
    }
}

export const CHART_VIEW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart View',
    menuGroup: 'Chart',
    description: 'Displays the data as a chart view.',
    ports: {
        in: {
            [PORT_DATASETS]: {
                type: 'dataset[]',
                multi: true
            },
            [PORT_X_AXES]: {
                type: 'axis',
                multi: true
            },
            [PORT_Y_AXES]: {
                type: 'axis',
                multi: true
            }
        },
        out: {
            [PORT_ON_CLICK]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        name: {
            label: 'Name',
            type: InputType.TEXT,
            initialValue: ''
        },
        type: {
            label: 'Type',
            type: InputType.SELECT,
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
            fieldGroup: 'More',
            type: InputType.DATA_ENTRIES,
            initialValue: []
        }
    },
    createProcessor(node, params) {
        const chartType = node.fields.type as string;
        const paramInputs = node.fields.params as Entry<string>[];
        
        const paramsMapper = expressions.compileEntriesMapper(paramInputs);
        const chartParams = paramsMapper(params.variables);

        let viewName = node.fields.name as string;
        if (!viewName) {
            viewName = getDefaultViewName(node);
        }

        return new ChartViewProcessor(params, viewName, { chartType, chartParams });
    }
};
