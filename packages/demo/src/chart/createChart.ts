import Chart, { ChartOptions } from 'chart.js';
import { DataPoint, AxisConfig, AxisType, DataSet, ChartConfig } from '../types/valueTypes';
import { asString, asNumber } from '../utils/converters';
import { writeKeyValues } from '../utils/keyPathUtils';

type DataMapper = (data: DataPoint[]) =>  Array<number | null | undefined> | Chart.ChartPoint[];

function createCategoryDataMapper(labels: string[]): DataMapper {
    return (data: DataPoint[]) => {
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
    return (data: DataPoint[]) => data;
}

function isCategoryData(xAxes: AxisConfig[]) {
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

function mapLabels(dataSets: DataSet[]): string[] {
    const labels = new Set<string>();

    for (const ds of dataSets) {
        for (const datum of ds.data) {
            const x = asString(datum.x);
            labels.add(x);
        }
    }

    return Array.from(labels);
}

function mapDataSetBackgroundColor(points: DataPoint[], backgroundColor: string) {
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

function mapDataSets(dataSets: DataSet[], dataMapper: DataMapper) {
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

function mapAxes(yAxis: boolean, axes: AxisConfig[]) {
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

function mapOnClickCallback(chartConfig: ChartConfig): ((event?: MouseEvent, activeElements?: Array<{}>) => void) | undefined {
    return undefined;
}


export function createChartConfiguration(chartConfig: ChartConfig): Chart.ChartConfiguration {
    let labels: string[] | undefined;
    let datasets: Chart.ChartDataSets[];
    
    if (isCategoryData(chartConfig.xAxes)) {
        labels = mapLabels(chartConfig.dataSets);
        datasets = mapDataSets(chartConfig.dataSets, createCategoryDataMapper(labels));

    } else {
        datasets = mapDataSets(chartConfig.dataSets, createPointDataMapper());
    }

    const xAxes = mapAxes(false, chartConfig.xAxes);
    const yAxes = mapAxes(true, chartConfig.yAxes);
    const onClick = mapOnClickCallback();

    const chartConfiguration: Chart.ChartConfiguration = {
        type: chartConfig.type,
        data: {
            datasets,
            labels
        },
        options: {
            scales: {
                xAxes,
                yAxes
            },
            onClick
        } as ChartOptions
    };

    writeKeyValues(chartConfig.params, chartConfiguration as any);
    return chartConfiguration;
}
