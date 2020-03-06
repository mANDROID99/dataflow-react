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
    x: unknown;
    y: unknown;
    r: unknown;
    bgColor: unknown;
    borderColor: unknown;
}

export type ChartDataSetPoints = {
    seriesKey: string | null;
    row: Row | null;
    points: ChartDataPoint[];
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

export type GridValueConfig = {
    value: string;
    fontColor?: string;
    bgColor?: string;
}

export type GridColumnConfig = {
    key: string;
    name: string;
    width: number;
    order: number;
    restTemplate: boolean;
    mapRow: (row: Row, rowIndex: number, columnKey: string) => Partial<GridValueConfig>;
}

export type GridViewConfig = {
    type: ViewType.GRID;
    columns: Column[];
    data: GridValueConfig[][];
}

export type ViewConfig = ChartViewConfig | GridViewConfig;
