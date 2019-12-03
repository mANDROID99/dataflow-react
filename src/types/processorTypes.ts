export enum DataType {
    ROW = 'row',
    ROW_GROUP = 'rowgroup',
    SCALAR = 'scalar',
    SELECTION = 'selection',
    OUTPUT = 'output'
}

export type Primitive = string | number | boolean | undefined;

export type Row = {
    type: DataType.ROW;
    rowId: string;
    selection: { [key: string]: Primitive };
    data: { [key: string]: Primitive };
}

export type RowGroup = {
    type: DataType.ROW_GROUP;
    rowId: string;
    selection: { [key: string]: Primitive };
    data: Row[];
}

export type Scalar = {
    type: DataType.SCALAR;
    rowId: string;
    value: Primitive;
}

export type Selection = {
    type: DataType.SELECTION;
    key: string;
}

export type OutputValue = {
    type: DataType.OUTPUT;
    rowId: string;
    key: string;
    value: Primitive;
}

export function createRow(rowId: string, data: { [key: string]: string | undefined }): Row {
    return {
        type: DataType.ROW,
        rowId,
        selection: {},
        data
    };
}

export function createRowGroup(rowId: string, data: Row[]): RowGroup {
    return {
        type: DataType.ROW_GROUP,
        rowId,
        selection: {},
        data
    };
}

export function createScalar(rowId: string, value: Primitive): Scalar {
    return {
        type: DataType.SCALAR,
        rowId,
        value
    };
}

export function createSelection(key: string): Selection {
    return {
        type: DataType.SELECTION,
        key
    };
}

export function createOutputValue(rowId: string, key: string, value: Primitive): OutputValue {
    return {
        type: DataType.OUTPUT,
        rowId,
        key,
        value
    };
}
