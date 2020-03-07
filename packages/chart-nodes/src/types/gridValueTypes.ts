import { Column } from "@react-ngraph/core"
import { Row, ViewType } from "./valueTypes"

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

export type GridConfig = {
    type: ViewType.GRID;
    columns: Column[];
    data: GridValueConfig[][];
}
