import { Column } from "@react-ngraph/core"
import { ViewType } from "./valueTypes"

export type GridValueConfig = {
    value: string;
    fontColor?: string;
    bgColor?: string;
}

export type GridColumnConfig = {
    name: string;
    width: number;
    order: number;
    values: GridValueConfig[];
}

export type GridConfig = {
    type: ViewType.GRID;
    columns: Column[];
    data: GridValueConfig[][];
}
