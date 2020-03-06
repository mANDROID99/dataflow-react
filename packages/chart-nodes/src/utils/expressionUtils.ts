import { Row } from "../types/valueTypes";

const KEY_ROW = 'row';
const KEY_ROW_INDEX = 'i';
const KEY_COLUMN_KEY = 'key';

export function rowToEvalContext(row: Row | null, rowIndex: number | null, colKey: string | null, variables: { [key: string]: unknown }) {
    const values = Object.assign({}, variables, row);
    values[KEY_ROW] = row;
    values[KEY_COLUMN_KEY] = colKey;
    values[KEY_ROW_INDEX] = rowIndex;
    return values;
}
