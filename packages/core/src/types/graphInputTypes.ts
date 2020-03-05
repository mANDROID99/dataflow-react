import { GraphNodeActions } from "./graphNodeComponentTypes";
import { GraphNodeFieldConfig } from "./graphConfigTypes";

export type InputProps<T> = {
    value: T | undefined;
    params: { [key: string]: unknown };
    fieldConfig: GraphNodeFieldConfig<any, any>;
    onChanged: (value: unknown) => void;
    context: any;
    actions: GraphNodeActions;
}

export enum InputType {
    TEXT = 'text',
    NUMBER = 'number',
    SELECT = 'select',
    CHECK = 'check',
    COLUMN_MAPPER = 'column-mapper',
    DATA_ENTRIES = 'data-entries',
    DATA_GRID = 'data-grid',
    DATA_LIST = 'data-list',
    ACTIONS = 'actions',
    MULTI = 'multi',
    COLOR = 'color'
}

export type Entry<T> = {
    key: string;
    value: T;
}

export type DataGridInputValue = {
    columns: string[];
    rows: string[][];
}

export enum ColumnMapperType {
    EXPRESSION='expression',
    COLUMN='column'
}

export type ColumnMapperInputValue = string | {
    type: ColumnMapperType.COLUMN;
    value: string;
}

export function columnExpression(column: string): ColumnMapperInputValue {
    return {
        type: ColumnMapperType.COLUMN,
        value: column
    };
}

export function emptyDataGrid(): DataGridInputValue {
    return {
        columns: [],
        rows: []
    };
}
