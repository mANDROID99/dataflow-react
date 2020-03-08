import { Entry } from "@react-ngraph/core"
import { ViewType, Row } from "./valueTypes"

export enum ChartAxisType {
    LINEAR = 'linear',
    CATEGORY = 'category',
    LOGARITHMIC = 'logarithmic',
    TIME = 'time'
}

export type ChartPointConfig = {
    x: unknown;
    y: unknown;
    r: unknown;
    bgColor?: string;
    borderColor?: string;
    row: Row;
}

export type ChartPointsConfig = {
    points: ChartPointConfig[];
    row: Row | null;
}

export type ChartDataSetConfig = {
    type: string;
    points: ChartPointConfig[];
    params: Entry<unknown>[];
    label?: string;
    bgColor?: string;
    borderColor?: string;
}

export type ChartAxisConfig = {
    type: ChartAxisType;
    label?: string;
    beginAtZero: boolean;
    stacked: boolean;
    params: Entry<unknown>[];
}

export enum ChartEventType {
    CLICK='click'
}

export type ChartEventConfig = {
    type: ChartEventType;
    action: (datasetIndex: number, index: number) => void;
}

export type ChartConfig = {
    type: ViewType.CHART;
    chartType: string;
    datasets: ChartDataSetConfig[];
    xAxes: ChartAxisConfig[];
    yAxes: ChartAxisConfig[];
    params: Entry<unknown>[];
    events: ChartEventConfig[];
}
