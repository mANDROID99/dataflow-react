import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";

import { Row, JoinType, EMPTY_ROWS, Rows, createRows } from "../../types/valueTypes";
import { ChartContext, ChartParams } from "../../chartContext";
import { asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";

type KeyExtractor = (row: Row, i: number) => string;

function merge(left: Row, right: Row): Row {
    const values = Object.assign({}, left.values, right.values);
    // TODO: groups?
    return { values };
}

function rowsToLookup(rows: Row[], keyFn: KeyExtractor) {
    const rowsByKey = new Map<string, Row>();

    for (let i = 0, n = rows.length; i < n; i++) {
        const row = rows[i];
        const key = keyFn(row, i);
        rowsByKey.set(key, row);
    }

    return rowsByKey;
}

function joinInner(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = [];

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            result.push(merge(row, rowRight));
        }
    }

    return result;
}

function joinLeft(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = new Array<Row>(left.length);

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            result[i] = merge(row, rowRight);

        } else {
            result[i] = row;
        }
    }

    return result;
}

function joinFull(left: Row[], right: Row[], keyLeftFn: KeyExtractor, keyRightFn: KeyExtractor): Row[] {
    const rowsByKey = rowsToLookup(right, keyRightFn);
    const result: Row[] = [];

    for (let i = 0, n = left.length; i < n; i++) {
        const row = left[i];
        const key = keyLeftFn(row, i);

        if (rowsByKey.has(key)) {
            const rowRight = rowsByKey.get(key)!;
            rowsByKey.delete(key);
            result.push(merge(row, rowRight));

        } else {
            result.push(row);
        }
    }

    for (const row of rowsByKey.values()) {
        result.push(row);
    }

    return result;
}

export const JOIN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Join',
    menuGroup: 'Transform',
    ports: {
        in: {
            left: {
                type: 'row[]'
            },
            right: {
                type: 'row[]'
            }
        },
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    fields: {
        joinType: {
            label: 'Join Type',
            type: FieldInputType.SELECT,
            initialValue: JoinType.LEFT,
            params: {
                options: Object.values(JoinType)
            }
        },
        joinKeyLeft: {
            label: 'Map Key Left',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ parents }) => {
                const columns: string[] = parents.left[0]?.columns ?? [];
                return {
                    columns,
                    target: 'row'
                };
            }
        },
        joinKeyRight: {
            label: 'Map Key Right',
            type: FieldInputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: ({ parents }) => {
                const columns: string[] = parents.right[0]?.columns ?? [];
                return {
                    columns,
                    target: 'row'
                };
            }
        }
    },
    createProcessor({ next, node, params }) {
        const joinType = node.fields.joinType as JoinType;
        const joinKeyLeftExpr = node.fields.joinKeyLeft as ColumnMapperInputValue;
        const joinKeyRightExpr = node.fields.joinKeyRight as ColumnMapperInputValue;
        const mapJoinKeyLeft = expressionUtils.compileColumnMapper(joinKeyLeftExpr, 'row');
        const mapJoinKeyRight = expressionUtils.compileColumnMapper(joinKeyRightExpr, 'row');

        function extractKeyLeft(row: Row, index: number): string {
            const ctx = rowToEvalContext(row, index, params.variables);
            return asString(mapJoinKeyLeft(ctx));
        }

        function extractKeyRight(row: Row, index: number): string {
            const ctx = rowToEvalContext(row, index, params.variables);
            return asString(mapJoinKeyRight(ctx));
        }

        return {
            onNext(inputs) {
                const l = (inputs.left[0] || EMPTY_ROWS) as Rows;
                const r = (inputs.right[0] || EMPTY_ROWS) as Rows;

                const left: Row[] = l.rows;
                const right: Row[] = r.rows;

                let rows: Row[];
                switch (joinType) {
                    case JoinType.INNER:
                        rows = joinInner(left, right, extractKeyLeft, extractKeyRight);
                        break;

                    case JoinType.LEFT:
                        rows = joinLeft(left, right, extractKeyLeft, extractKeyRight);
                        break;
                    
                    case JoinType.FULL:
                        rows = joinFull(left, right, extractKeyLeft, extractKeyRight);
                        break;
                }

                next('rows', createRows(rows));
            }
        };
    }
};
