import { NodeProcessor } from "./processorTypes"

export type ComputedField = {
    value: unknown;
    params: { [key: string]: unknown };
}

export type ComputedNode<Ctx> = {
    context: Ctx;
    processor: NodeProcessor;
    fields: {
        [key: string]: ComputedField;
    };
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
    NUMBER = 'number',
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

// export function columnExpression(column: string): ColumnMapperInputValue {
//     return {
//         type: ColumnMapperType.COLUMN,
//         value: column
//     };
// }

// export function emptyDataGrid(): DataGridInputValue {
//     return {
//         columns: [],
//         rows: []
//     };
// }

export type GraphFieldInputConfig = {
    component: React.ComponentType<FieldInputProps<any>>;
    initialValue: unknown;
    resolveValue?: (cfg: unknown, params: { [key: string]: unknown }) => any;
    validate?: (cfg: unknown) => boolean;
}
