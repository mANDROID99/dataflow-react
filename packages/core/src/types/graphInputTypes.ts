import { NodeActions } from "../editor/components/graphnode/graphNodeActions";

export type InputProps<T> = {
    nodeId: string;
    fieldName: string;
    value: T | undefined;
    params: { [key: string]: unknown };
    actions: NodeActions;
    onChanged: (value: unknown) => void;
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
    ACTIONS = 'actions'
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
