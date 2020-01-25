import { Row, ChartDataPoint } from "../types/valueTypes";

const KEY_ROW = 'row';
const KEY_INDEX = 'index';

export function rowToEvalContext(row: Row, index: number | null, variables: { [key: string]: unknown }) {
    const values = Object.assign({}, variables);
    values[KEY_ROW] = row.values;
    values[KEY_INDEX] = index;
    return values;
}

export function pointToEvalContext(point: ChartDataPoint, index: number | null, variables: { [key: string]: unknown }) {
    const values = Object.assign({}, variables);
    values[KEY_ROW] = point.row.values;
    values[KEY_INDEX] = index;
    return values;
}
