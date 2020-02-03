import { GraphNodeConfig, FieldInputType, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ChartDataPoint, ChartDataSet } from "../../types/valueTypes";
import { asString } from '../../utils/converters';
import { pointToEvalContext } from '../../utils/expressionUtils';
import { NodeType } from "../nodes";

const PORT_POINTS = 'points';
const PORT_DATASETS = 'datasets';

type Fields = {
    type: string;
    series: expressions.Mapper,
    label: expressions.Mapper,
    borderColor: expressions.Mapper,
    backgroundColor: expressions.Mapper,
    params: expressions.EntriesMapper
}

class DataSetNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly fields: Fields,
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
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        if (!this.subs.length) {
            return;
        }

        const points = value as ChartDataPoint[];
        const dataSetsByKey = new Map<string, ChartDataSet>();
        const dataSets: ChartDataSet[] = [];

        if (points.length) {
            for (let i = 0, n = points.length; i < n; i++){
                const point = points[i];
                const ctx = pointToEvalContext(point, i, this.context);
                const seriesKey = asString(this.fields.series(ctx));
                let dataSet: ChartDataSet | undefined = dataSetsByKey.get(seriesKey);
                
                if (!dataSet) {
                    const params = this.fields.params(ctx);
                    const label = asString(this.fields.label(ctx));
                    const borderColor = asString(this.fields.borderColor(ctx));
                    const backgroundColor = asString(this.fields.backgroundColor(ctx));

                    dataSet = {
                        type: this.fields.type,
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

        for (const sub of this.subs) {
            sub(dataSets);
        }
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
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        label: {
            label: 'Map Label',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        borderColor: {
            label: 'Map Border Color',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        backgroundColor: {
            label: 'Map Background Color',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        params: {
            label: 'Params',
            type: FieldInputType.DATA_ENTRIES
        }
    },
    createProcessor({ fields, params }) {
        return new DataSetNodeProcessor(
            fields as Fields,
            params.variables
        );
    }
};
