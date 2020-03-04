import { GraphNodeConfig, InputType, ColumnMapperInputValue, Entry, expressions, BaseNodeProcessor, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, ChartDataSet } from "../../types/valueTypes";
import { zipObjKeys } from "../../utils/arrayUtils";

const PORT_IN_DATA = 'data';
const PORT_IN_LABEL = 'label';
const PORT_IN_BG_COLOR = 'bg-color';
const PORT_IN_BORDER_COLOR = 'border-color';
const PORT_OUT_DATASETS = 'datasets';

type Config = {
    datasetType: string,
    mapSeriesKey: expressions.Mapper,
    mapParams: expressions.EntriesMapper,
    mapLabel: expressions.Mapper,
    mapBorderColor: expressions.Mapper,
    mapBackgroundColor: expressions.Mapper,
}

class DataSetNodeProcessor extends BaseNodeProcessor {
    private data?: ChartDataPoint[][];
    private labels?: string[];
    private bgColors?: string[];
    private borderColors?: string[];
    private readonly awaiting = new Set<string>();

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor): number {
        this.awaiting.add(portIn);
        return super.registerConnectionInverse(portOut, portIn, processor);
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_DATA) {
            this.data = inputs[0] as ChartDataPoint[][];
            
        } else if (portName === PORT_IN_LABEL) {
            this.labels = inputs[0] as string[];

        } else if (portName === PORT_IN_BORDER_COLOR) {
            this.borderColors = inputs[0] as string[];

        } else if (portName === PORT_IN_BG_COLOR) {
            this.bgColors = inputs[0] as string[];
        }

        this.awaiting.delete(portName);
        if (!this.awaiting.size) {
            this.update();
        }
    }

    private update() {
        const params = this.config.mapParams(this.params.variables);
        const type = this.config.datasetType;

        const datasets = zipObjKeys<ChartDataSet>({
            data: this.data,
            label: this.labels,
            borderColor: this.borderColors,
            backgroundColor: this.bgColors,
            params: [params],
            type: [type]
        });

        this.emitResult(PORT_OUT_DATASETS, datasets);
    }
}


export const DATA_SET_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Sets' ,
    menuGroup: 'Chart',
    description: 'Constructs datasets (series) for the chart.',
    width: 200,
    ports: {
        in: {
            [PORT_IN_DATA]: {
                type: 'datapoint[]'
            },
            [PORT_IN_LABEL]: {
                type: 'value[]'
            },
            [PORT_IN_BG_COLOR]: {
                type: 'value[]'
            },
            [PORT_IN_BORDER_COLOR]: {
                type: 'value[]'
            }
        },
        out: {
            [PORT_OUT_DATASETS]: {
                type: 'dataset[]'
            }
        }
    },
    fields: {
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
        const datasetType = node.fields.type as string;
        const mapLabelExpr = node.fields.label as ColumnMapperInputValue;
        const mapSeriesExpr = node.fields.series as ColumnMapperInputValue;
        const mapBorderColorExpr = node.fields.borderColor as ColumnMapperInputValue;
        const mapBackgroundColorExpr = node.fields.backgroundColor as ColumnMapperInputValue;
        const paramInputs = node.fields.params as Entry<string>[];

        const mapLabel = expressions.compileColumnMapper(mapLabelExpr, 'row');
        const mapSeriesKey = expressions.compileColumnMapper(mapSeriesExpr, 'row');
        const mapBorderColor = expressions.compileColumnMapper(mapBorderColorExpr, 'row');
        const mapBackgroundColor = expressions.compileColumnMapper(mapBackgroundColorExpr, 'row');
        const mapParams = expressions.compileEntriesMapper(paramInputs);

        return new DataSetNodeProcessor(params, {
            datasetType,
            mapLabel,
            mapSeriesKey,
            mapBorderColor,
            mapBackgroundColor,
            mapParams
        });
    }
};
