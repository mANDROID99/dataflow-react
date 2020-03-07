import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, Entry, expressions, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartPointsConfig, ChartDataSetConfig } from "../../types/chartValueTypes";
import { asString } from '../../utils/conversions';
import { rowToEvalContext } from '../../utils/expressionUtils';
import { ColorScheme } from "../styling/ColorSchemeNode";

const PORT_IN_POINTS = 'points';
const PORT_IN_COLOR_SCHEME = 'color-scheme';
const PORT_OUT_DATASETS = 'datasets';

const FIELD_CHART_TYPE = 'type';
const FIELD_PARAMS = 'params';
const FIELD_LABEL = 'label';
const FIELD_BG_COLOR = 'bgColor';
const FIELD_BORDER_COLOR = 'borderColor';

type Config = {
    chartType: string;
    mapParams: expressions.EntriesMapper;
    mapLabel: expressions.Mapper;
    mapBorderColor: expressions.Mapper;
    mapBackgroundColor: expressions.Mapper;
}

class ChartDataSetNodeProcessor extends BaseNodeProcessor {
    private points?: ChartPointsConfig[];
    private colorScheme?: ColorScheme;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_POINTS) {
            this.points = inputs[0] as ChartPointsConfig[];

        } else if (portName === PORT_IN_COLOR_SCHEME) {
            this.colorScheme = inputs[0] as ColorScheme;
        }

        if (this.isReady()) {
            this.update();
        }
    }

    private update() {
        const pointSets: ChartPointsConfig[] | undefined = this.points;
        if (!pointSets) return;
        
        const colorScheme = this.colorScheme;
        const chartType = this.config.chartType;

        const datasets: ChartDataSetConfig[] = pointSets.map((pointSet, i): ChartDataSetConfig => {
            // map dataset attributes
            const ctx = rowToEvalContext(pointSet.row, i, null, this.params.variables);
            const params = this.config.mapParams(ctx);
            const label = asString(this.config.mapLabel(ctx), undefined);
            const points = pointSet.points;
            
            let borderColor = asString(this.config.mapBorderColor(ctx)) || undefined;
            let bgColor = asString(this.config.mapBackgroundColor(ctx)) || undefined;

            // apply the color-scheme
            if (colorScheme) {
                const n = pointSets.length;

                // color-scheme controls the color of the line for a line-chart
                if (chartType === 'line' && borderColor == null) {
                    borderColor = colorScheme.getColorAt(i, n);
                }

                if (bgColor == null) {
                    bgColor = colorScheme.getColorAt(i, n);
                }
            }

            return {
                type: chartType,
                params,
                label,
                points,
                bgColor,
                borderColor
            };
        });

        this.emitResult(PORT_OUT_DATASETS, datasets);
    }
}

export const CHART_DATA_SETS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Chart Datasets' ,
    menuGroup: 'Chart',
    description: 'Maps the datasets of the chart',
    width: 200,
    ports: {
        in: {
            [PORT_IN_POINTS]: {
                type: 'datapoint[]'
            },
            [PORT_IN_COLOR_SCHEME]: {
                type: 'color-scheme'
            }
        },
        out: {
            [PORT_OUT_DATASETS]: {
                type: 'dataset[]'
            }
        }
    },
    fields: {
        [FIELD_CHART_TYPE]: {
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
        [FIELD_LABEL]: {
            label: 'Map Label',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_BG_COLOR]: {
            label: 'Map Background Color',
            fieldGroup: 'Styling',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_BORDER_COLOR]: {
            label: 'Map Border Color',
            fieldGroup: 'Styling',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
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
        const chartType = node.fields[FIELD_CHART_TYPE] as string;
        const mapLabelExpr = node.fields[FIELD_LABEL] as ColumnMapperInputValue;
        const mapBackgroundColorExpr = node.fields[FIELD_BG_COLOR] as ColumnMapperInputValue;
        const mapBorderColorExpr = node.fields[FIELD_BORDER_COLOR] as ColumnMapperInputValue;
        const paramExprs = node.fields[FIELD_PARAMS] as Entry<string>[];

        const mapLabel = expressions.compileColumnMapper(mapLabelExpr);
        const mapBorderColor = expressions.compileColumnMapper(mapBorderColorExpr);
        const mapBackgroundColor = expressions.compileColumnMapper(mapBackgroundColorExpr);
        const mapParams = expressions.compileEntriesMapper(paramExprs);

        return new ChartDataSetNodeProcessor(params, {
            chartType,
            mapLabel,
            mapBorderColor,
            mapBackgroundColor,
            mapParams
        });
    }
};
