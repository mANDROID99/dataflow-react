import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, Entry, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ChartDataPoint, ChartDataSet } from "../../types/valueTypes";
import { asString } from '../../utils/converters';
import { pointToEvalContext } from '../../utils/expressionUtils';

export const DATA_SET_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Sets' ,
    menuGroup: 'Chart',
    width: 200,
    ports: {
        in: {
            points: {
                type: 'datapoint[]'
            }
        },
        out: {
            datasets: {
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
    createProcessor({ next, node, params }) {
        const type = node.fields.type as string;
        const mapLabelExpr = node.fields.label as ColumnMapperInputValue;
        const mapSeriesExpr = node.fields.series as ColumnMapperInputValue;
        const mapBorderColorExpr = node.fields.borderColor as ColumnMapperInputValue;
        const mapBackgroundColorExpr = node.fields.backgroundColor as ColumnMapperInputValue;
        const paramInputs = node.fields.params as Entry<string>[];

        const mapLabel = expressionUtils.compileColumnMapper(mapLabelExpr, 'row');
        const mapSeries = expressionUtils.compileColumnMapper(mapSeriesExpr, 'row');
        const mapBorderColor = expressionUtils.compileColumnMapper(mapBorderColorExpr, 'row');
        const mapBackgroundColor = expressionUtils.compileColumnMapper(mapBackgroundColorExpr, 'row');
        const mapParams = expressionUtils.compileEntryMappers(paramInputs);

        return {
            onNext(inputs) {
                const allPoints = inputs.points as ChartDataPoint[][];
                const points: ChartDataPoint[] = allPoints[0] ?? [];

                const dataSetsByKey = new Map<string, ChartDataSet>();
                const dataSets: ChartDataSet[] = [];

                if (points.length) {
                    for (let i = 0, n = points.length; i < n; i++){
                        const point = points[i];
                        const ctx = pointToEvalContext(point, i, params.variables);
                        const seriesKey = asString(mapSeries(ctx));
                        let dataSet: ChartDataSet | undefined = dataSetsByKey.get(seriesKey);
                        
                        if (!dataSet) {
                            const params = mapParams(ctx);
                            const label = asString(mapLabel(ctx));
                            const borderColor = asString(mapBorderColor(ctx));
                            const backgroundColor = asString(mapBackgroundColor(ctx));

                            dataSet = {
                                type,
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

                next('datasets', dataSets);
            }
        }
    }
};
