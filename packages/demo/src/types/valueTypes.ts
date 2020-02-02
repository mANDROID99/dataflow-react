import { Column, Entry } from "@react-ngraph/core"

export enum ValueType {
    ROWS = 'rows',
    ROW_GROUPS = 'row-groups'
}

export enum JoinType {
    LEFT = 'left',
    INNER = 'inner',
    FULL = 'full',
}

export enum AxisType {
    LINEAR = 'linear',
    CATEGORY = 'category',
    LOGARITHMIC = 'logarithmic',
    TIME = 'time'
}

export const KEY_GROUP = Symbol();

export type Row = {
    [key: string]: unknown;
    [KEY_GROUP]?: Row[];
}

export type ChartDataPoint = {
    x: number | string | Date;
    y: number | string | Date;
    r?: number;
    color: string;
    row: Row;
}

export type ChartDataSet = {
    type: string;
    label: string;
    data: ChartDataPoint[];
    params: Entry<unknown>[];
    borderColor: string;
    backgroundColor: string;
}

export type ChartAxisConfig = {
    type: AxisType;
    params: Entry<unknown>[];
    label?: string;
}

export enum ChartEventType {
    CLICK='click'
}

export type ChartEventConfig = {
    type: ChartEventType;
    action: (datasetIndex: number, index: number) => void;
}

export enum ViewType {
    CHART = 'chart',
    GRID = 'grid'
}

export type ChartViewConfig = {
    type: ViewType.CHART;
    chartType: string;
    datasets: ChartDataSet[];
    xAxes: ChartAxisConfig[];
    yAxes: ChartAxisConfig[];
    params: Entry<unknown>[];
    events: ChartEventConfig[];
}

export type GridViewConfig = {
    type: ViewType.GRID;
    columns: Column[];
    rows: unknown[][];
}

export type ViewConfig = ChartViewConfig | GridViewConfig;
