import React, { useReducer, useMemo } from 'react';
import produce from 'immer';

import { Column } from './dataGridTypes';
import DataGridToolbar from './DataGridToolbar';
import DataGridHeaders from './DataGridHeaders';
import DataGridBody from './DataGridBody';

type Props = {
    columns: Column[];
    data: string[][];
}

export type RowState = {
    values: string[];
    selected: boolean;
}

export type ColumnState = {
    column: Column;
    width: number;
}

type State = {
    originalData: string[][];
    originalColumns: Column[];
    columns: ColumnState[];
    rows: RowState[];
}

export enum ActionType {
    RESIZE_COLUMN,
    CHANGE_CELL_VALUE,
    TOGGLE_SELECT_ROW,
    TOGGLE_SELECT_ALL,
    DELETE_SELECTED_ROWS,
    INSERT_ROW_BEFORE,
    INSERT_ROW_AFTER
}

export type Action =
    | { type: ActionType.RESIZE_COLUMN; col: number; width: number }
    | { type: ActionType.CHANGE_CELL_VALUE; col: number; row: number; value: string }
    | { type: ActionType.TOGGLE_SELECT_ALL }
    | { type: ActionType.TOGGLE_SELECT_ROW; row: number }
    | { type: ActionType.DELETE_SELECTED_ROWS }
    | { type: ActionType.INSERT_ROW_BEFORE }
    | { type: ActionType.INSERT_ROW_AFTER };

function init(params: { data: string[][]; columns: Column[] }): State {
    const columns = params.columns.map((column): ColumnState => {
        return {
            column,
            width: column.width
        };
    });

    const rows = params.data.map((values): RowState => {
        return {
            values,
            selected: false
        };
    });

    return {
        originalColumns: params.columns,
        originalData: params.data,
        columns,
        rows
    };
}

function areAllRowsSelected(rows: RowState[]): boolean {
    return !rows.some(row => !row.selected);
}

function createRow(numCols: number): RowState {
    const values: string[] = new Array(numCols);
    values.fill('');
    return {
        selected: true,
        values
    };
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

        case ActionType.TOGGLE_SELECT_ROW: {
            return produce(state, (draft) => {
                const row = draft.rows[action.row];
                if (row) row.selected = !row.selected;
            });
        }

        case ActionType.TOGGLE_SELECT_ALL: {
            const toggled = areAllRowsSelected(state.rows);
            return produce(state, (draft) => {
                for (const row of draft.rows) {
                    row.selected = !toggled;
                }
            });
        }

        case ActionType.DELETE_SELECTED_ROWS: {
            const rows = state.rows.filter(row => !row.selected);
            return { ...state, rows };
        }

        case ActionType.INSERT_ROW_AFTER: {
            const rows = state.rows.flatMap(row => {
                if (row.selected) {
                    row = { ...row, selected: false };
                    const newRow = createRow(state.columns.length);
                    return [row, newRow];
                } else {
                    return [row];
                }
            });
            return { ...state, rows };
        }

        case ActionType.INSERT_ROW_BEFORE: {
            const rows = state.rows.flatMap(row => {
                if (row.selected) {
                    row = { ...row, selected: false };
                    const newRow = createRow(state.columns.length);
                    return [newRow, row];
                } else {
                    return [row];
                }
            });
            return { ...state, rows };
        }

        default:
            return state;
    }
}

export default function DataGrid({ columns, data }: Props): React.ReactElement | null {
    const [state, dispatch] = useReducer(reducer, { columns, data }, init);

    const gridTemplateColumns = useMemo(() => {
        const cols: string[] = [];
        cols.push('40px');

        state.columns.forEach((col, i, arr) => {
            cols.push(i === arr.length - 1 ? 'auto' : col.width + 'px');
        });
        return cols.join(' ');
    }, [state.columns]);

    const allSelected = useMemo(() => {
        return areAllRowsSelected(state.rows);
    }, [state.rows]);

    return (
        <div className="datagrid-container">
            <div className="flex-grow bg-light-200">
                <div className="datagrid" style={{ gridTemplateColumns }}>
                    <DataGridHeaders
                        allSelected={allSelected}
                        columns={state.columns}
                        dispatch={dispatch}
                    />
                    <DataGridBody rows={state.rows} dispatch={dispatch}/>
                </div>
            </div>
            <DataGridToolbar/>
        </div>
    );
}
