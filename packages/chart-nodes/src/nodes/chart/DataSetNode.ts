import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, Entry, expressions, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, ChartDataSet } from "../../types/valueTypes";
import { asString } from '../../utils/conversions';
import { pointToEvalContext } from '../../utils/expressionUtils';
import { COMPUTE_CONTEXT_MERGE_INPUTS } from "../../chartContext";

const PORT_POINTS = 'points';
const PORT_DATASETS = 'datasets';

type Config = {
    datasetType: string,
    mapSeriesKey: expressions.Mapper,
    mapParams: expressions.EntriesMapper,
    mapLabel: expressions.Mapper,
    mapBorderColor: expressions.Mapper,
    mapBackgroundColor: expressions.Mapper,
}

class DataSetNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName !== PORT_POINTS) {
            return;
        }

        const points = inputs[0] as ChartDataPoint[];
        const dataSetsByKey = new Map<string, ChartDataSet>();
        const dataSets: ChartDataSet[] = [];

        if (points.length) {
            for (let i = 0, n = points.length; i < n; i++){
                const point = points[i];
                const ctx = pointToEvalContext(point, i, this.params.variables);

                const seriesKey = asString(this.config.mapSeriesKey(ctx));
                let dataSet: ChartDataSet | undefined = dataSetsByKey.get(seriesKey);
                
                if (!dataSet) {
                    const params = this.config.mapParams(ctx);
                    const label = asString(this.config.mapLabel(ctx));
                    const borderColor = asString(this.config.mapBorderColor(ctx));
                    const backgroundColor = asString(this.config.mapBackgroundColor(ctx));

                    dataSet = {
                        type: this.config.datasetType,
                        label,
                        backgroundColor,
                        borderColor,
                        params,
                        data: [],
                    }

                    dataSetsByKey.set(seriesKey, dataSet);
                    dataSets.push(dataSet);
                }

                dataSet.data.push(point);
            }
        }

        this.emitResult(PORT_DATASETS, dataSets);
    }
}


export const DATA_SET_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Sets' ,
    menuGroup: 'Chart',
    description: 'Constructs datasets (series) for the chart.',
    width: 200,
    ports: {
        in: {
            [PORT_POINTS]: {
                type: 'datapoint[]'
            }
        },
        out: {
            [PORT_DATASETS]: {
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
        series: {
            label: 'Map Series Key',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        label: {
            label: 'Map Label',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        borderColor: {
            label: 'Map Border Color',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        backgroundColor: {
            label: 'Map Background Color',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        params: {
            label: 'Params',
            type: InputType.DATA_ENTRIES,
            initialValue: []
        }
    },
    computeContext: COMPUTE_CONTEXT_MERGE_INPUTS,
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
