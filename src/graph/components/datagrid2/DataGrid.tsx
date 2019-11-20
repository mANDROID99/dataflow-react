import React, { useReducer, useMemo, useState } from 'react';
import produce from 'immer';

import { Column } from './dataGridTypes';
import DataGridToolbar from './DataGridToolbar';
import DataGridHeaders from './DataGridHeaders';
import DataGridRows from './DataGridRows';
import DataGridContextMenu from './DataGridContextMenu';

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
    name: string;
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
    CHANGE_COLUMN_HEADER,
    TOGGLE_SELECT_ROW,
    TOGGLE_SELECT_ALL,
    DELETE_SELECTED_ROWS,
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
    | { type: ActionType.TOGGLE_SELECT_ALL }
    | { type: ActionType.TOGGLE_SELECT_ROW; row: number }
    | { type: ActionType.DELETE_SELECTED_ROWS }
    | { type: ActionType.INSERT_ROW_BEFORE }
    | { type: ActionType.INSERT_ROW_AFTER }
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
    return {
        selected: false,
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

        case ActionType.CHANGE_COLUMN_HEADER: {
            return produce(state, (draft) => {
                const col = draft.columns[action.col];
                if (col) col.name = action.value;
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
                    const newRow = createRowState(state.columns.length);
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
                    const newRow = createRowState(state.columns.length);
                    return [newRow, row];
                } else {
                    return [row];
                }
            });
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

export default function DataGrid({ columns, data }: Props): React.ReactElement | null {
    const [state, dispatch] = useReducer(reducer, { columns, data }, init);

    const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number } | undefined>(undefined);

    const handleShowContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setShowContextMenu({
            x: event.pageX,
            y: event.pageY
        });
    };

    const handleHideContextMenu = () => {
        setShowContextMenu(undefined);
    };

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
        <>
            <div className="datagrid-container" onContextMenu={handleShowContextMenu}>
                <div className="datagrid" style={{ gridTemplateColumns }}>
                    <DataGridHeaders
                        allSelected={allSelected}
                        columns={state.columns}
                        dispatch={dispatch}
                    />
                    <DataGridRows
                        rows={state.rows}
                        dispatch={dispatch}
                    />
                </div>
                <DataGridContextMenu
                    mousePos={showContextMenu}
                    onHide={handleHideContextMenu}
                    dispatch={dispatch}
                />
            </div>
            <DataGridToolbar
                numCols={state.columns.length}
                numRows={state.rows.length}
                dispatch={dispatch}
            />
        </>
    );
}
