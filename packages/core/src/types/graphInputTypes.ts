import { GraphNodeActions } from "./graphNodeComponentTypes";
import { GraphNodeFieldConfig } from "./graphConfigTypes";

export type InputProps<T> = {
    value: T | undefined;
    params: { [key: string]: unknown };
    fields: { [key: string]: unknown };
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
    DATA_GRID = 'data-grid',
    ACTIONS = 'actions',
    MULTI = 'multi',
    COLOR = 'color'
}

export type Entry<T> = {
    key: string;
    value: T;
}

export type Option = string | { value: string; label: string };

export type DataGridInputValue = {
    columns: string[];
    rows: string[][];
}

export function emptyDataGrid(): DataGridInputValue {
    return {
        columns: [],
        rows: []
    };
}
