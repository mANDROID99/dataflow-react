
export type GraphNodeContext<Ctx, Params> = {
    context: Ctx;
    params: Params;
    parents: { [key: string]: Ctx[] };
}

export type FieldInputProps<T> = {
    nodeId: string;
    fieldName: string;
    value: T | undefined;
    params: { [key: string]: unknown };
    onChanged: (value: T) => void;
}

export enum FieldInputType {
    TEXT = 'text',
    SELECT = 'select',
    CHECK = 'check',
    COLUMN_MAPPER = 'column-mapper',
    DATA_ENTRIES = 'data-entries',
    DATA_GRID = 'data-grid',
    DATA_LIST = 'data-list'
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
