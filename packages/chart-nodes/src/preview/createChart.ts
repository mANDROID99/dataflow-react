import Chart, { ChartOptions } from 'chart.js';
import { ChartDataPoint, ChartAxisConfig, AxisType, ChartDataSet, ChartViewConfig, ChartEventConfig, ChartEventType } from '../types/valueTypes';
import { asString, asNumber } from '../utils/conversions';
import { writeKeyValues } from '../utils/keyPathUtils';

type DataMapper = (data: ChartDataPoint[]) =>  Array<number | null | undefined> | Chart.ChartPoint[];

function createCategoryDataMapper(labels: string[]): DataMapper {
    return (data: ChartDataPoint[]) => {
        const lookup = new Map<string, number>();

        for (const datum of data) {
            const x = asString(datum.x);
            const y = asNumber(datum.y);
            lookup.set(x, y);
        }

        return labels.map(lbl => lookup.get(lbl) ?? null);
    };
}

function createPointDataMapper(): DataMapper {
    return (data: ChartDataPoint[]) => data;
}

function isCategoryData(xAxes: ChartAxisConfig[]) {
    if (xAxes.length) {
        return xAxes.some(axis => axis.type === AxisType.CATEGORY);
    } else {
        return true;
    }
}

function resolveAxisId(yAxis: boolean, i: number) {
    if (yAxis) {
        return 'y-axis-' + i;
    } else {
        return 'x-axis-' + i;
    }
}

function mapLabels(dataSets: ChartDataSet[]): string[] {
    const labels = new Set<string>();

    for (const ds of dataSets) {
        for (const datum of ds.data) {
            const x = asString(datum.x);
            labels.add(x);
        }
    }

    return Array.from(labels);
}

function mapDataSetBackgroundColor(points: ChartDataPoint[], backgroundColor: string) {
    let bg: string[] | undefined;
    
    for (let i = 0, n = points.length; i < n; i++) {
        const point = points[i];

        if (point.color) {
            if (!bg) {
                bg = new Array(n);
                bg.fill(backgroundColor);
            }

            bg[i] = point.color;
        }
    }

    return bg ?? backgroundColor;
}

function mapDataSets(dataSets: ChartDataSet[], dataMapper: DataMapper) {
    return dataSets.map((ds): Chart.ChartDataSets => {
        const data = dataMapper(ds.data);
        const dataSet: Chart.ChartDataSets = {
            type: ds.type,
            data,
            label: ds.label
        };

        if (ds.borderColor) {
            dataSet.borderColor = ds.borderColor;
        }

        dataSet.backgroundColor = mapDataSetBackgroundColor(ds.data, ds.backgroundColor);

        writeKeyValues(ds.params, dataSet as any);
        return dataSet;
    });
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
        
        writeKeyValues(axisConfig.params, axis as any);
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

export function createChartConfiguration(chartConfig: ChartViewConfig): Chart.ChartConfiguration {
    let labels: string[] | undefined;
    let datasets: Chart.ChartDataSets[];
    
    if (isCategoryData(chartConfig.xAxes)) {
        labels = mapLabels(chartConfig.datasets);
        datasets = mapDataSets(chartConfig.datasets, createCategoryDataMapper(labels));

    } else {
        datasets = mapDataSets(chartConfig.datasets, createPointDataMapper());
    }

    const xAxes = mapAxes(false, chartConfig.xAxes);
    const yAxes = mapAxes(true, chartConfig.yAxes);
    const onClick = mapOnClickCallback(chartConfig.events);

    const chartConfiguration: Chart.ChartConfiguration = {
        type: chartConfig.chartType,
        data: {
            datasets,
            labels
        },
        options: {
            scales: {
                xAxes,
                yAxes
            },
            maintainAspectRatio: false,
            onClick
        } as ChartOptions
    };

    writeKeyValues(chartConfig.params, chartConfiguration as any);
    return chartConfiguration;
}
