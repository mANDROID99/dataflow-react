import Chart, { ChartOptions } from 'chart.js';
import { ChartAxisConfig, ChartAxisType, ChartEventConfig, ChartEventType, ChartConfig } from '../types/chartValueTypes';
import { asString, asNumber } from '../utils/conversions';
import { writeKeyPaths } from '../utils/keyPathUtils';
import { Indexer } from '../utils/chart/Indexer';

function isCategorical(chartConfig: ChartConfig) {
    const xAxes = chartConfig.xAxes;
    const n = xAxes.length;

    // default axis type is "category"
    if (!n) {
        return true;
    }

    for (let i = 0; i < n; i++) {
        if (xAxes[i].type === ChartAxisType.CATEGORY) {
            return true;
        }
    }

    return false;
}

function mapChartData(chartConfig: ChartConfig): Chart.ChartData {
    const categorical = isCategorical(chartConfig);
    const indexer = categorical ? new Indexer() : undefined;

    const datasets = chartConfig.datasets.map((dataset, i): Chart.ChartDataSets => {
        const ds: Chart.ChartDataSets = {};
        ds.borderColor = dataset.borderColor;
        ds.backgroundColor = dataset.bgColor;
        ds.label = dataset.label;

        const points = dataset.points;
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
            ds.data = new Array<Chart.ChartPoint>(n);

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
        writeKeyPaths(dataset.params, ds);

        return ds;
    });

    return {
        datasets,
        labels: indexer?.getKeys()
    };
}

function resolveAxisId(yAxis: boolean, i: number) {
    if (yAxis) {
        return 'y-axis-' + i;
    } else {
        return 'x-axis-' + i;
    }
}

function mapAxes(yAxis: boolean, axes: ChartAxisConfig[]) {
    return axes.map((axisConfig, i): Chart.CommonAxe => {
        const id = resolveAxisId(yAxis, i);
        const axis: Chart.CommonAxe = {
            id,
            type: axisConfig.type
        };

        if (axisConfig.label) {
            axis.scaleLabel = {
                display: true,
                labelString: axisConfig.label
            };
        }

        if (axisConfig.beginAtZero) {
            axis.ticks = {
                beginAtZero: true
            };
        }
        
        writeKeyPaths(axisConfig.params, axis);
        return axis;
    });
}

function mapOnClickCallback(events: ChartEventConfig[]): ((event?: MouseEvent, activeElements?: Array<{}>) => void) | undefined {
    for (const event of events) {
        if (event.type === ChartEventType.CLICK) {
            return (e, activeElements) => {
                const el = activeElements?.[0] as any;
                if (el) {
                    event.action(el._datasetIndex, el._index);
                }
            }
        }
    }
}

export function createChartConfiguration(chartConfig: ChartConfig): Chart.ChartConfiguration {
    const data = mapChartData(chartConfig);
    const xAxes = mapAxes(false, chartConfig.xAxes);
    const yAxes = mapAxes(true, chartConfig.yAxes);
    const onClick = mapOnClickCallback(chartConfig.events);

    const chartConfiguration: Chart.ChartConfiguration = {
        type: chartConfig.chartType,
        data,
        options: {
            scales: {
                xAxes,
                yAxes
            },
            maintainAspectRatio: false,
            onClick
        } as ChartOptions
    };

    writeKeyPaths(chartConfig.params, chartConfiguration);
    return chartConfiguration;
}
