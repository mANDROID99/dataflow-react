import React, { useMemo, useReducer, useEffect } from 'react';
import DataGrid, { Column, RowsUpdateEvent } from 'react-data-grid';

import { reducer, Action, ActionType, RowMenuState, ColumnMenuState } from './editableDataGridReducer';
import ContextMenu, { ContextMenuParams } from '../ContextMenu';
import HeaderRenderer from './EditableDataGridHeader';
import { gridContext, EditableGridContext } from './context';
import EditableDataGridRow from './EditableDataGridRow';

export type GridConfig = {
    columns: string[];
    rows: string[][];
}

export type Props = {
    config: GridConfig;
    setConfig: (config: GridConfig) => void;
}

function mapColumn(name: string, index: number): Column<string[]> {
    return {
        name,
        key: '' + index,
        editable: true,
        resizable: true,
        width: 100,
        headerRenderer: HeaderRenderer
    };
}

function createContextMenuCol(state: ColumnMenuState, nCols: number, dispatch: React.Dispatch<Action>): ContextMenuParams {
    return {
        title: 'Grid Column',
        x: state.x,
        y: state.y,
        onHide: () => {
            dispatch({ type: ActionType.HIDE_COLUMN_MENU });
        },
        items: [
            {
                label: 'Insert Column Before',
                action() {
                    const col = state.col;
                    dispatch({ type: ActionType.INSERT_COLUMN_BEFORE, col });
                }
            },
            {
                label: 'Insert Column After',
                action() {
                    const col = state.col;
                    dispatch({ type: ActionType.INSERT_COLUMN_AFTER, col });
                }
            },
            {
                label: 'Delete Column',
                disabled: nCols <= 1,
                action() {
                    const col = state.col;
                    dispatch({ type: ActionType.DELETE_COLUMN, col });
                }
            }
        ]
    }
}

function createContextMenuRow(state: RowMenuState, nRows: number, dispatch: React.Dispatch<Action>): ContextMenuParams {
    return {
        title: 'Grid Row',
        x: state.x,
        y: state.y,
        onHide: () => {
            dispatch({ type: ActionType.HIDE_ROW_MENU });
        },
        items: [
            {
                label: 'Insert Row Before',
                action() {
                    const row = state.row;
                    dispatch({ type: ActionType.INSERT_ROW_BEFORE, row });
                }
            },
            {
                label: 'Insert Row After',
                action() {
                    const row = state.row;
                    dispatch({ type: ActionType.INSERT_ROW_AFTER, row });
                }
            },
            {
                label: 'Delete Row',
                disabled: nRows <= 1,
                action() {
                    const row = state.row;
                    dispatch({ type: ActionType.DELETE_ROW, row });
                }
            }
        ]
    };
}

export default function EditableDataGrid({ config, setConfig }: Props) {
    const [state, dispatch] = useReducer(reducer, config);
    const nRows = state.rows.length;
    const nCols = state.columns.length;

    const contextMenuRow = useMemo(() => {
        return state.menuRow && createContextMenuRow(state.menuRow, nRows, dispatch);
    }, [state.menuRow, nRows]);

    const contextMenuCol = useMemo(() => {
        return state.menuColumn && createContextMenuCol(state.menuColumn, nCols, dispatch);
    }, [state.menuColumn, nCols])

    const columns = useMemo(() => {
        return state.columns.map(mapColumn);
    }, [state.columns]);

    const contextValue = useMemo((): EditableGridContext => {
        return { dispatch };
    }, [dispatch]);

    useEffect(() => {
        setConfig({
            columns: state.columns,
            rows: state.rows
        });
    }, [state, setConfig]);

    return (
        <gridContext.Provider value={contextValue}>
            <DataGrid
                columns={columns}
                rows={state.rows}
                width={700}
                height={700}
                onRowsUpdate={({ fromRow, toRow, updated }: RowsUpdateEvent<string[]>) => {
                    dispatch({ type: ActionType.UPDATE_ROWS, fromRow, toRow, updated });
                }}
                rowRenderer={EditableDataGridRow}
            />
            <ContextMenu value={contextMenuRow || contextMenuCol}/>
        </gridContext.Provider>
    );
}
