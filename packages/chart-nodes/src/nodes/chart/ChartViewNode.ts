import { GraphNodeConfig, InputType, Entry, expressions, GraphNode, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataSet, ChartAxisConfig, ChartViewConfig, ChartEventType, ViewType, ViewConfig, ChartEventConfig } from "../../types/valueTypes";
import { NodeType } from "../nodes";

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

class ChartViewProcessor implements NodeProcessor {
    private readonly onClickSubs: ((value: unknown) => void)[] = [];

    private datasets: ChartDataSet[][];
    private xAxes: ChartAxisConfig[];
    private yAxes: ChartAxisConfig[];
    private isReady = false;

    constructor(
        private readonly params: ChartParams,
        private readonly viewName: string,
        private readonly config: Config
    ) {
        this.datasets = [];
        this.xAxes = [];
        this.yAxes = [];
    }

    get type(): string {
        return NodeType.CHART_VIEW;
    }

    register(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_DATASETS) {
            const i = this.datasets.length++;
            processor.subscribe(portOut, this.onNextDatasets.bind(this, i));

        } else if (portIn === PORT_X_AXES) {
            const i = this.xAxes.length++;
            processor.subscribe(portOut, this.onNextXAxis.bind(this, i));

        } else if (portIn === PORT_Y_AXES) {
            const i = this.yAxes.length++;
            processor.subscribe(portOut, this.onNextYAxis.bind(this, i));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ON_CLICK) {
            this.onClickSubs.push(sub);
        }
    }

    private onNextDatasets(index: number, value: unknown) {
        this.datasets[index] = value as ChartDataSet[];
        this.update();
    }

    private onNextXAxis(index: number, value: unknown) {
        this.xAxes[index] = value as ChartAxisConfig;
        this.update();
    }

    private onNextYAxis(index: number, value: unknown) {
        this.yAxes[index] = value as ChartAxisConfig;
        this.update();
    }

    private allReceived(x: unknown[]) {
        for(let i = 0, n = x.length; i < n; i++) {
            if (!(i in x)) return false;
        }
        return true;
    }

    private checkReady() {
        if (this.isReady) {
            return true;
        }

        if (this.allReceived(this.datasets) && this.allReceived(this.xAxes) && this.allReceived(this.yAxes)) {
            this.isReady = true;
            return true;
        }

         return false;
    }

    private update() {
        if (!this.checkReady()) {
            return;
        }

        const datasets = this.datasets.flat();
        const events: ChartEventConfig[] = [];

        const onClickSubs = this.onClickSubs;
        if (onClickSubs.length) {
            events.push({
                type: ChartEventType.CLICK,
                action: (datasetIndex, index) => {
                    const ds = datasets[datasetIndex];
                    if (!ds) return;

                    const datum = ds.data[index];
                    if (!datum) return;

                    for (const sub of onClickSubs) {
                        sub([datum.row]);
                    }
                }
            })
        }

        const chart: ChartViewConfig = {
            type: ViewType.CHART,
            chartType: this.config.chartType,
            datasets: datasets,
            xAxes: this.xAxes,
            yAxes: this.yAxes,
            params: this.config.chartParams,
            events
        };

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
