import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, Entry, expressions, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartPoint } from "chart.js";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataSetPoints } from "../../types/valueTypes";
import { asString, asNumber } from '../../utils/conversions';
import { rowToEvalContext } from '../../utils/expressionUtils';
import { ColorScheme } from "../styling/ColorSchemeNode";
import { writeKeyPaths } from "../../utils/keyPathUtils";
import { Indexer } from "../../utils/chart/Indexer";

const PORT_IN_POINTS = 'points';
const PORT_IN_COLOR_SCHEME = 'color-scheme';
const PORT_IN_INDEXER = 'indexer';
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

class DataSetNodeProcessor extends BaseNodeProcessor {
    private points?: ChartDataSetPoints[];
    private colorScheme?: ColorScheme;
    private indexer?: Indexer;

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName === PORT_IN_POINTS) {
            this.points = inputs[0] as ChartDataSetPoints[];

        } else if (portName === PORT_IN_COLOR_SCHEME) {
            this.colorScheme = inputs[0] as ColorScheme;

        } else if (portName === PORT_IN_INDEXER) {
            this.indexer = inputs[0] as Indexer;
        }

        if (this.isReady()) {
            this.update();
        }
    }

    private update() {
        const pointSets = this.points;
        if (!pointSets) return;
        
        const colorScheme = this.colorScheme;
        const indexer = this.indexer;
        const chartType = this.config.chartType;

        // map point-groups to chart data-sets
        const datasets: Chart.ChartDataSets[] = pointSets.map((group, i) => {
            const ds: Chart.ChartDataSets = { };
            
            // map dataset attributes
            const ctx = rowToEvalContext(group.row, i, null, this.params.variables);
            const params = this.config.mapParams(ctx);
            ds.label = asString(this.config.mapLabel(ctx), undefined);
            ds.borderColor = asString(this.config.mapBorderColor(ctx), undefined);
            ds.backgroundColor = asString(this.config.mapBackgroundColor(ctx), undefined);
            
            // apply the color-scheme
            if (colorScheme) {
                const n = pointSets.length;

                // color-scheme controls the color of the line for a line-chart
                if (chartType === 'line' && ds.borderColor == null) {
                    ds.borderColor = colorScheme.getColorAt(i, n);
                }

                if (ds.backgroundColor == null) {
                    ds.backgroundColor = colorScheme.getColorAt(i, n);
                }
            }

            const points = group.points;
            const n = points.length;
            if (indexer) {
                ds.data = new Array(indexer.getKeys().length);

                for (let i = 0; i < n; i++) {
                    const point = points[i];
                    const key = asString(point.x);
                    const idx = indexer.next(key);
                    ds.data[idx] = asNumber(point.y);

                    // override background color with point
                    if (point.bgColor != null) {
                        if (!Array.isArray(ds.backgroundColor)) {
                            ds.backgroundColor = new Array(indexer.getKeys().length);
                        }
                        ds.backgroundColor[idx] = asString(point.bgColor);
                    }

                    // override border color with point
                    if (point.borderColor != null) {
                        if (!Array.isArray(ds.borderColor)) {
                            ds.borderColor = new Array(indexer.getKeys().length);
                        }
                        ds.borderColor[idx] = asString(point.borderColor);
                    }
                }

            } else {
                ds.data = new Array<ChartPoint>(n);

                for (let i = 0; i < n; i++) {
                    const point = points[i];
                    ds.data[i] = {
                        x: point.x as any,
                        y: point.y as any,
                        r: point.r as any
                    };

                    // override background color with point
                    if (point.bgColor != null) {
                        if (!Array.isArray(ds.backgroundColor)) {
                            ds.backgroundColor = new Array(n);
                        }
                        ds.backgroundColor[i] = asString(point.bgColor);
                    }

                    // override border color with point
                    if (point.borderColor != null) {
                        if (!Array.isArray(ds.borderColor)) {
                            ds.borderColor = new Array(n);
                        }
                        ds.borderColor[i] = asString(point.borderColor);
                    }
                }
            }

            // write params to the dataset
            writeKeyPaths(params, ds as any);

            return ds;
        });

        const labels = indexer?.getKeys();
        const data: Chart.ChartData = {
            datasets,
            labels
        };

        this.emitResult(PORT_OUT_DATASETS, data);
    }
}

export const CHART_DATA_SETS_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Sets' ,
    menuGroup: 'Chart',
    description: 'Constructs datasets (series) for the chart.',
    width: 200,
    ports: {
        in: {
            [PORT_IN_POINTS]: {
                type: 'datapoint[]'
            },
            [PORT_IN_COLOR_SCHEME]: {
                type: 'color-scheme'
            },
            [PORT_IN_INDEXER]: {
                type: 'indexer'
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
                target: 'row',
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
                target: 'row',
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
                target: 'row',
                columns: context.columns
            })
        },
        [FIELD_PARAMS]: {
            label: 'Params',
            fieldGroup: 'More',
            type: InputType.DATA_ENTRIES,
            initialValue: []
        }
    },
    createProcessor(node, params) {
        const chartType = node.fields[FIELD_CHART_TYPE] as string;
        const mapLabelExpr = node.fields[FIELD_LABEL] as ColumnMapperInputValue;
        const mapBackgroundColorExpr = node.fields[FIELD_BG_COLOR] as ColumnMapperInputValue;
        const mapBorderColorExpr = node.fields[FIELD_BORDER_COLOR] as ColumnMapperInputValue;
        const paramInputs = node.fields[FIELD_PARAMS] as Entry<string>[];

        const mapLabel = expressions.compileColumnMapper(mapLabelExpr, 'row');
        const mapBorderColor = expressions.compileColumnMapper(mapBorderColorExpr, 'row');
        const mapBackgroundColor = expressions.compileColumnMapper(mapBackgroundColorExpr, 'row');
        const mapParams = expressions.compileEntriesMapper(paramInputs);

        return new DataSetNodeProcessor(params, {
            chartType,
            mapLabel,
            mapBorderColor,
            mapBackgroundColor,
            mapParams
        });
    }
};
