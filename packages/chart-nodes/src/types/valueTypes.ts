import { ChartConfig } from "./chartValueTypes";
import { GridConfig } from "./gridValueTypes";

export enum ValueType {
    ROWS = 'rows',
    ROW_GROUPS = 'row-groups'
}

export enum JoinType {
    LEFT = 'left',
    INNER = 'inner',
    FULL = 'full',
}

export enum ViewType {
    CHART = 'chart',
    GRID = 'grid'
}

export const KEY_GROUP = Symbol();

export type Row = {
    [key: string]: unknown;
    [KEY_GROUP]?: Row[];
}

export type ViewConfig = ChartConfig | GridConfig;
