
export type ProcessorInput<T> = {
    parentView?: string;
    value: T;
}

export type Row = { [key: string]: unknown };

export type BuiltInGraphParams = {
    variables: { [key: string]: unknown };
};

export type BuiltInGraphContext = {
    columns: string[];
};

export enum BuiltInNodeType {
    DATA_GRID = 'data-grid',
    GRID_WIDGET = 'grid-widget'
};
