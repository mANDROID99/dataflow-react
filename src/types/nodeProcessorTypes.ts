export enum DataType {
    ROW = 'row',
    ROW_GROUP = 'rowgroup',
    SCALAR = 'scalar',
    OUTPUT_VALUE = 'output'
}

export type Row = {
    type: DataType.ROW,
    correlationId: string;
    parent: string[];
    data: { [key: string]: string | undefined };
}

export type RowGroup = {
    type: DataType.ROW_GROUP;
    correlationId: string;
    parent: string[];
    rows: Row[];
}

export type Scalar = {
    type: DataType.SCALAR;
    correlationId: string;
    parent: string[];
    value: string | number | boolean;
}

export type OutputValue = {
    type: DataType.OUTPUT_VALUE,
    correlationId: string;
    parent: string[];
    outputKey: string;
    outputValue: string | number | boolean;
}

export function createRow(correlationId: string, parent: string[], data: { [key: string]: string | undefined }): Row {
    return {
        type: DataType.ROW,
        correlationId,
        parent,
        data
    };
}

export function createRowGroup(correlationId: string, parent: string[], rows: Row[]): RowGroup {
    return {
        type: DataType.ROW_GROUP,
        correlationId,
        parent,
        rows
    };
}

export function createScalar(correlationId: string, parent: string[], value: string | number | boolean): Scalar {
    return {
        type: DataType.SCALAR,
        correlationId,
        parent,
        value
    };
}

export function createOutputValue(correlationId: string, parent: string[], outputKey: string, outputValue: string | number | boolean): OutputValue {
    return {
        type: DataType.OUTPUT_VALUE,
        correlationId,
        parent,
        outputKey,
        outputValue
    };
}
