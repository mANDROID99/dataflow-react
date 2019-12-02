export enum DataType {
    ROW = 'row',
    ROW_GROUP = 'rowgroup',
    SCALAR = 'scalar',
    KEY_VALUE = 'output'
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

export type KeyValue = {
    type: DataType.KEY_VALUE;
    key: string;
    value: string | number | boolean;
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

export function createKeyValueValue(correlationId: string, parent: string[], key: string, value: string | number | boolean): NodeValue<KeyValue> {
    return {
        correlationId,
        parent,
        data: {
            type: DataType.KEY_VALUE,
            key,
            value
        }
    };
}
