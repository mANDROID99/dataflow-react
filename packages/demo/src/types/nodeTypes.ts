import { Entry } from "@react-ngraph/editor"

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

export type DataPoint = {
    x: number | string | Date;
    y: number | string | Date;
    r?: number;
    color: string;
    row: Row;
}

export type DataSet = {
    type: string;
    label: string;
    data: DataPoint[];
    params: Entry<unknown>[];
    borderColor: string;
    backgroundColor: string;
}

export type AxisConfig = {
    type: AxisType;
    params: Entry<unknown>[];
    label?: string;
}

export type ChartConfig = {
    type: string;
    dataSets: DataSet[];
    xAxes: AxisConfig[];
    yAxes: AxisConfig[];
    params: Entry<unknown>[];
}
