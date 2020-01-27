import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, Entry, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ChartDataPoint, ChartDataSet } from "../../types/valueTypes";
import { asString } from '../../utils/converters';
import { pointToEvalContext } from '../../utils/expressionUtils';
import { NodeType } from "../nodes";

const PORT_POINTS = 'points';
const PORT_DATASETS = 'datasets';

class DataSetNodeProcessor implements NodeProcessor {
    private sub?: (value: unknown) => void;

    constructor(
        private readonly datasetType: string,
        private readonly seriesKeyMapper: expressions.Mapper,
        private readonly paramsMapper: expressions.EntriesMapper,
        private readonly labelMapper: expressions.Mapper,
        private readonly borderColorMapper: expressions.Mapper,
        private readonly backgroundColorMapper: expressions.Mapper,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.DATA_SETS;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_POINTS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_DATASETS) {
            this.sub = sub;
        }
    }

    private onNext(value: unknown) {
        if (!this.sub) {
            return;
        }

        const points = value as ChartDataPoint[];
        const dataSetsByKey = new Map<string, ChartDataSet>();
        const dataSets: ChartDataSet[] = [];

        if (points.length) {
            for (let i = 0, n = points.length; i < n; i++){
                const point = points[i];
                const ctx = pointToEvalContext(point, i, this.context);
                const seriesKey = asString(this.seriesKeyMapper(ctx));
                let dataSet: ChartDataSet | undefined = dataSetsByKey.get(seriesKey);
                
                if (!dataSet) {
                    const params = this.paramsMapper(ctx);
                    const label = asString(this.labelMapper(ctx));
                    const borderColor = asString(this.borderColorMapper(ctx));
                    const backgroundColor = asString(this.backgroundColorMapper(ctx));

                    dataSet = {
                        type: this.datasetType,
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

        this.sub(dataSets);
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
        series: {
            label: 'Map Series Key',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        label: {
            label: 'Map Label',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        borderColor: {
            label: 'Map Border Color',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        backgroundColor: {
            label: 'Map Background Color',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        params: {
            label: 'Params',
            type: FieldInputType.DATA_ENTRIES,
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

        const labelMapper = expressions.compileColumnMapper(mapLabelExpr, 'row');
        const seriesKeyMapper = expressions.compileColumnMapper(mapSeriesExpr, 'row');
        const borderColorMapper = expressions.compileColumnMapper(mapBorderColorExpr, 'row');
        const backgroundColorMapper = expressions.compileColumnMapper(mapBackgroundColorExpr, 'row');
        const paramsMapper = expressions.compileEntriesMapper(paramInputs);

        return new DataSetNodeProcessor(
            datasetType,
            seriesKeyMapper,
            paramsMapper,
            labelMapper,
            borderColorMapper,
            backgroundColorMapper,
            params.variables
        );
    }
};
