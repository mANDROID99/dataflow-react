export enum DataType {
    ROW = 'row',
    ROW_GROUP = 'rowgroup',
    SCALAR = 'scalar',
    SELECTION = 'selection'
}

export type NodeValue<T> = {
    correlationId: string;
    parent: string[];
    data: T;
}

export type Row = {
    type: DataType.ROW;
    data: { [key: string]: string | undefined };
}

export type RowGroup = {
    type: DataType.ROW_GROUP;
    rows: Row[];
}

export type Scalar = {
    type: DataType.SCALAR;
    value: string | number | boolean;
}

export type Selection = {
    type: DataType.SELECTION;
    values: {
        [key: string]: string | number | boolean;
    };
}

export function createRowValue(correlationId: string, parent: string[], data: { [key: string]: string | undefined }): NodeValue<Row> {
    return {
        correlationId,
        parent,
        data: {
            type: DataType.ROW,
            data
        }
    };
}

export function createRowGroupValue(correlationId: string, parent: string[], rows: Row[]): NodeValue<RowGroup> {
    return {
        correlationId,
        parent,
        data: {
            type: DataType.ROW_GROUP,
            rows
        }
    };
}

export function createScalarValue(correlationId: string, parent: string[], value: string | number | boolean): NodeValue<Scalar> {
    return {
        correlationId,
        parent,
        data: {
            type: DataType.SCALAR,
            value
        }
    };
}

export function createSelectionValue(correlationId: string, parent: string[], values: { [key: string]: string | number | boolean }): NodeValue<Selection> {
    return {
        correlationId,
        parent,
        data: {
            type: DataType.SELECTION,
            values
        }
    };
}
