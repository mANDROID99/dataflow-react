import { BaseNodeProcessor, Entry, GraphNodeConfig, InputType, NodeProcessor } from "@react-ngraph/core";
import { ChartAxisConfig, ChartConfig, ChartDataSetConfig, ChartEventConfig, ChartEventType } from "../../types/chartValueTypes";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ViewType } from "../../types/valueTypes";
import { compileEntriesMapper } from "../../utils/expressionUtils";

const PORT_IN_DATASETS = 'datasets';
const PORT_IN_X_AXES = 'xAxes';
const PORT_IN_Y_AXES = 'yAxes';
const PORT_OUT_ONCLICK = 'onClick';

const FIELD_VIEW_NAME = 'name';
const FIELD_TYPE = 'type';
const FIELD_PARAMS = 'params';

type Config = {
    chartType: string;
    chartParams: Entry<unknown>[];
}

class ChartViewProcessor extends BaseNodeProcessor {
    private datasets?: ChartDataSetConfig[][];
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
        if (portIn === PORT_IN_DATASETS) {
            this.datasets = undefined;
        } else if (portIn === PORT_IN_X_AXES) {
            this.xAxes = undefined;
        } else if (portIn === PORT_IN_Y_AXES) {
            this.yAxes = undefined;
        }
        return super.registerConnectionInverse(portOut, portIn, processor);
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_DATASETS) {
            this.datasets = inputs as ChartDataSetConfig[][];
            this.update();

        } else if (portName === PORT_IN_X_AXES) {
            this.xAxes = inputs as ChartAxisConfig[];
            this.update();

        } else if (portName === PORT_IN_Y_AXES) {
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

                const datum = ds.points[index];
                if (!datum) return;

                this.emitResult(PORT_OUT_ONCLICK, [datum.row]);
            }
        })

        // chart config
        const chart: ChartConfig = {
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
    title: 'Chart',
    menuGroup: 'Chart',
    description: 'Displays the data as a chart view.',
    ports: {
        in: {
            [PORT_IN_DATASETS]: {
                type: 'dataset[]',
                multi: true
            },
            [PORT_IN_X_AXES]: {
                type: 'axis',
                multi: true
            },
            [PORT_IN_Y_AXES]: {
                type: 'axis',
                multi: true
            }
        },
        out: {
            [PORT_OUT_ONCLICK]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        [FIELD_VIEW_NAME]: {
            label: 'Name',
            type: InputType.TEXT,
            initialValue: ''
        },
        [FIELD_TYPE]: {
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
        [FIELD_PARAMS]: {
            label: 'Params',
            fieldGroup: 'More',
            type: InputType.MULTI,
            initialValue: [],
            subFields: {
                key: {
                    label: 'Key',
                    type: InputType.TEXT,
                    initialValue: ''
                },
                value: {
                    label: 'Value',
                    type: InputType.TEXT,
                    initialValue: ''
                }
            }
        }
    },
    createProcessor(node, params) {
        const chartType = node.fields[FIELD_TYPE] as string;
        const paramInputs = node.fields[FIELD_PARAMS] as Entry<string>[];
        
        const paramsMapper = compileEntriesMapper(paramInputs);
        const chartParams = paramsMapper(params.variables);

        let viewName = node.fields[FIELD_VIEW_NAME] as string;
        if (!viewName) {
            viewName = 'chart-' + node.id;
        }

        return new ChartViewProcessor(params, viewName, { chartType, chartParams });
    }
};
