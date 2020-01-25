import { Entry } from "@react-ngraph/core"

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
    values: { [key: string]: unknown };
    group?: Row[];
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

export type ChartConfig = {
    type: string;
    dataSets: ChartDataSet[];
    xAxes: ChartAxisConfig[];
    yAxes: ChartAxisConfig[];
    params: Entry<unknown>[];
    events: ChartEventConfig[];
}
