import { Entry } from "@react-ngraph/core"

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

export type Row = {
    [key: string]: unknown;
}

export type Rows = {
    type: ValueType.ROWS;
    rows: Row[];
}

export type RowGroup = {
    selection: {
        [key: string]: unknown;
    };
    rows: Row[];
}

export type RowGroups = {
    type: ValueType.ROW_GROUPS,
    groups: RowGroup[];
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
    viewType: ViewType.CHART;
    type: string;
    dataSets: ChartDataSet[];
    xAxes: ChartAxisConfig[];
    yAxes: ChartAxisConfig[];
    params: Entry<unknown>[];
    events: ChartEventConfig[];
}

export type GridViewConfig = {
    viewType: ViewType.GRID,
    rows: Row[];
}

export type ViewConfig = ChartViewConfig | GridViewConfig;

export const EMPTY_ROWS: Rows = {
    type: ValueType.ROWS,
    rows: []
}

export function createRows(rows: Row[]): Rows {
    return {
        type: ValueType.ROWS,
        rows
    };
}

export function createRowGroups(groups: RowGroup[]): RowGroups {
    return {
        type: ValueType.ROW_GROUPS,
        groups
    };
}
