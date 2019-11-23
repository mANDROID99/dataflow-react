import React, { useReducer, useMemo } from 'react';
import produce from 'immer';

import { Column } from './dataGridTypes';
import DataGridToolbar from './DataGridToolbar';
import DataGridHeaders from './DataGridHeaders';
import DataGridRows from './DataGridRows';

type Props = {
    columns: Column[];
    data: string[][];
}

export type RowState = {
    values: string[];
}

export type ColumnState = {
    column: Column;
    width: number;
    name: string;
}

type State = {
    originalData: string[][];
    originalColumns: Column[];
    columns: ColumnState[];
    rows: RowState[];
    selection: number[];
}

export enum ActionType {
    RESIZE_COLUMN,
    CHANGE_CELL_VALUE,
    CHANGE_COLUMN_HEADER,
    DELETE_ROW,
    INSERT_ROW_BEFORE,
    INSERT_ROW_AFTER,
    DELETE_COLUMN,
    INSERT_COLUMN_BEFORE,
    INSERT_COLUMN_AFTER,
    SET_NUM_ROWS,
    SET_NUM_COLS
}

export type Action =
    | { type: ActionType.RESIZE_COLUMN; col: number; width: number }
    | { type: ActionType.CHANGE_CELL_VALUE; col: number; row: number; value: string }
    | { type: ActionType.CHANGE_COLUMN_HEADER; col: number; value: string }
    | { type: ActionType.DELETE_ROW; row: number }
    | { type: ActionType.INSERT_ROW_BEFORE; row: number }
    | { type: ActionType.INSERT_ROW_AFTER; row: number }
    | { type: ActionType.DELETE_COLUMN; col: number }
    | { type: ActionType.INSERT_COLUMN_BEFORE; col: number }
    | { type: ActionType.INSERT_COLUMN_AFTER; col: number }
    | { type: ActionType.SET_NUM_ROWS; count: number }
    | { type: ActionType.SET_NUM_COLS; count: number };

function init(params: { data: string[][]; columns: Column[] }): State {
    const columns = params.columns.map((column): ColumnState => {
        return {
            column,
            width: column.width,
            name: column.name
        };
    });

    const rows = params.data.map((values): RowState => {
        return { values };
    });

    return {
        originalColumns: params.columns,
        originalData: params.data,
        columns,
        rows,
        selection: []
    };
}

function createColumnState(): ColumnState {
    const column: Column = { name: '', width: 100, minWidth: 50 };
    return {
        column,
        width: column.width,
        name: ''
    };
}

function createRowState(numCols: number): RowState {
    const values: string[] = new Array(numCols);
    values.fill('');
    return { values };
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.RESIZE_COLUMN: {
            return produce(state, (draft) => {
                const column = draft.columns[action.col];
                if (column) column.width = action.width;
            });
        }

        case ActionType.CHANGE_CELL_VALUE: {
            return produce(state, (draft) => {
                const row = draft.rows[action.row];
                if (row) row.values[action.col] = action.value;
            });
        }

        case ActionType.CHANGE_COLUMN_HEADER: {
            return produce(state, (draft) => {
                const col = draft.columns[action.col];
                if (col) col.name = action.value;
            });
        }

        case ActionType.DELETE_ROW: {
            const rows = state.rows.slice(0);
            rows.splice(action.row, 1);
            return { ...state, rows };
        }

        case ActionType.INSERT_ROW_AFTER: {
            const rows = state.rows.slice(0);
            const newRow = createRowState(state.columns.length);
            rows.splice(action.row + 1, 0, newRow);
            return { ...state, rows };
        }

        case ActionType.INSERT_ROW_BEFORE: {
            const rows = state.rows.slice(0);
            const newRow = createRowState(state.columns.length);
            rows.splice(action.row, 0, newRow);
            return { ...state, rows };
        }

        case ActionType.DELETE_COLUMN: {
            const columns = state.columns.slice(0);
            columns.splice(action.col, 1);

            const rows = state.rows.map(row => {
                const values = row.values.slice(0);
                values.splice(action.col, 1);
                return { ...row, values };
            });

            return { ...state, columns, rows };
        }

        case ActionType.INSERT_COLUMN_AFTER: {
            const columns = state.columns.slice(0);
            const newColumn = createColumnState();
            columns.splice(action.col + 1, 0, newColumn);

            const rows = state.rows.map(row => {
                const values = row.values.slice(0);
                values.splice(action.col + 1, 0, '');
                return { ...row, values };
            });

            return { ...state, columns, rows };
        }

        case ActionType.INSERT_COLUMN_BEFORE: {
            const columns = state.columns.slice(0);
            const newColumn = createColumnState();
            columns.splice(action.col, 0, newColumn);

            const rows = state.rows.map(row => {
                const values = row.values.slice(0);
                values.splice(action.col, 0, '');
                return { ...row, values };
            });

            return { ...state, columns, rows };
        }

        case ActionType.SET_NUM_COLS: {
            const columns = state.columns.slice(0);
            const n = columns.length;
            columns.length = action.count;

            for (let i = n; i < action.count; i++) {
                columns[i] = createColumnState();
            }

            const rows = state.rows.map(row => {
                const values = row.values.slice(0);
                const n = values.length;
                values.length = action.count;

                for (let i = n; i < action.count; i++) {
                    values[i] = '';
                }

                return { ...row, values };
            });

            return { ...state, columns, rows };
        }

        case ActionType.SET_NUM_ROWS: {
            const rows = state.rows.slice(0);
            const n = rows.length;
            rows.length = action.count;

            for (let i = n; i < action.count; i++) {
                rows[i] = createRowState(state.columns.length);
            }

            return { ...state, rows };
        }

        default:
            return state;
    }
}

export default function DataGrid({ columns, data }: Props) {
    const [state, dispatch] = useReducer(reducer, { columns, data }, init);

    const gridTemplateColumns = useMemo(() => {
        const cols: string[] = [];
        state.columns.forEach(col => {
            cols.push(col.width + 'px');
        });

        cols.push('auto');
        return cols.join(' ');
    }, [state.columns]);

    return (
        <>
            <div className="datagrid-container">
                <div className="datagrid" style={{ gridTemplateColumns }}>
                    <DataGridHeaders
                        columns={state.columns}
                        dispatch={dispatch}
                    />
                    <DataGridRows
                        rows={state.rows}
                        dispatch={dispatch}
                    />
                </div>
            </div>
            <DataGridToolbar
                numCols={state.columns.length}
                numRows={state.rows.length}
                dispatch={dispatch}
            />
        </>
    );
}
