import React, { useReducer, useMemo } from 'react';
import produce from 'immer';

import { Column } from './dataGridTypes';
import DataGridToolbar from './DataGridToolbar';
import DataGridHeaders from './DataGridHeaders';
import DataGridRows from './DataGridRows';

type Props = {
    columns: Column[];
    rows: string[][];
    onHide: () => void;
    onSave: (column: Column[], rows: string[][]) => void;
}

type State = {
    originalData: string[][];
    originalColumns: Column[];
    rows: string[][];
    columns: Column[];
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
    return {
        originalColumns: params.columns,
        originalData: params.data,
        columns: params.columns,
        rows: params.data
    };
}

function createColumn(): Column {
    return {
        name: '',
        width: 100,
        minWidth: 50
    };
}

function createRow(numCols: number): string[] {
    const values: string[] = new Array(numCols);
    values.fill('');
    return values;
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
                if (row) row[action.col] = action.value;
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
            const newRow = createRow(state.columns.length);
            rows.splice(action.row + 1, 0, newRow);
            return { ...state, rows };
        }

        case ActionType.INSERT_ROW_BEFORE: {
            const rows = state.rows.slice(0);
            const newRow = createRow(state.columns.length);
            rows.splice(action.row, 0, newRow);
            return { ...state, rows };
        }

        case ActionType.DELETE_COLUMN: {
            const columns = state.columns.slice(0);
            columns.splice(action.col, 1);

            const rows = state.rows.map(row => {
                row = row.slice(0);
                row.splice(action.col, 1);
                return row;
            });

            return { ...state, columns, rows };
        }

        case ActionType.INSERT_COLUMN_AFTER: {
            const columns = state.columns.slice(0);
            const newColumn = createColumn();
            columns.splice(action.col + 1, 0, newColumn);

            const rows = state.rows.map(row => {
                row = row.slice(0);
                row.splice(action.col + 1, 0, '');
                return row;
            });

            return { ...state, columns, rows };
        }

        case ActionType.INSERT_COLUMN_BEFORE: {
            const columns = state.columns.slice(0);
            const newColumn = createColumn();
            columns.splice(action.col, 0, newColumn);

            const rows = state.rows.map(row => {
                row = row.slice(0);
                row.splice(action.col, 0, '');
                return row;
            });

            return { ...state, columns, rows };
        }

        case ActionType.SET_NUM_COLS: {
            const columns = state.columns.slice(0);
            const n = columns.length;
            columns.length = action.count;

            for (let i = n; i < action.count; i++) {
                columns[i] = createColumn();
            }

            const rows = state.rows.map(row => {
                row = row.slice(0);
                const n = row.length;
                row.length = action.count;
                for (let i = n; i < action.count; i++) {
                    row[i] = '';
                }
                return row;
            });

            return { ...state, columns, rows };
        }

        case ActionType.SET_NUM_ROWS: {
            const rows = state.rows.slice(0);
            const n = rows.length;
            rows.length = action.count;

            for (let i = n; i < action.count; i++) {
                rows[i] = createRow(state.columns.length);
            }

            return { ...state, rows };
        }

        default:
            return state;
    }
}

export default function DataGrid({ columns, rows: data, onHide, onSave }: Props) {
    const [state, dispatch] = useReducer(reducer, { columns, data }, init);

    const gridTemplateColumns = useMemo(() => {
        const cols: string[] = [];
        state.columns.forEach(col => {
            cols.push(col.width + 'px');
        });

        cols.push('auto');
        return cols.join(' ');
    }, [state.columns]);

    const handleSaveChanges = () => {
        onSave(state.columns, state.rows);
    };

    return (
        <div className="modal-content">
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
            <div className="modal-footer">
                <button className="form-btn" onClick={onHide}>Cancel</button>
                <button className="form-btn primary ml-2" onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
}
