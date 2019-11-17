import React, { useReducer, useEffect } from "react";
import { DataGridHeaderGroup } from "./DataGridHeaders";
import { DataGridRow } from "./DataGridRow";
import DataGridAddRow from "./DataGridAddRow";

type State = {
    originalData: string[][];
    originalColumns: Column[];
    data: string[][];
    columns: Column[];
    columnWidths: number[];
}

export type Column = {
    name: string;
    width: number;
    minWidth?: number;
    maxWidth?: number;
}

export enum ActionType {
    INIT,
    SET_CELL_VALUE,
    SET_COLUMN_NAME,
    SET_COLUMN_WIDTH,
    ADD_ROW,
    DELETE_ROW,
    ADD_COLUMN,
    DELETE_COLUMN
}

export type Action =
    | { type: ActionType.INIT; data: string[][]; columns: Column[] }
    | { type: ActionType.SET_CELL_VALUE; row: number; col: number; value: string }
    | { type: ActionType.SET_COLUMN_NAME; col: number; name: string }
    | { type: ActionType.SET_COLUMN_WIDTH; col: number; width: number }
    | { type: ActionType.ADD_ROW }
    | { type: ActionType.DELETE_ROW; row: number }
    | { type: ActionType.ADD_COLUMN; column: Column }
    | { type: ActionType.DELETE_COLUMN; col: number };


function computeColumnWidths(columns: Column[]): number[] {
    return columns.map(col => col.width);
}

function init(params: { data: string[][]; columns: Column[] }): State {
    const data = params.data;
    const columns = params.columns;
    const columnWidths = computeColumnWidths(columns);

    return {
        originalData: data,
        originalColumns: columns,
        data,
        columns,
        columnWidths
    };
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.INIT: {
            return init(action);
        }

        case ActionType.SET_CELL_VALUE: {
            const data = state.data.slice(0);
            const row = data[action.row].slice(0);
            row[action.col] = action.value;
            data[action.row] = row;
            return { ...state, data };
        }

        case ActionType.SET_COLUMN_NAME: {
            const columns = state.columns.slice(0);
            const column = columns[action.col];
            columns[action.col] = { ...column, name: action.name };
            return { ...state, columns };
        }

        case ActionType.SET_COLUMN_WIDTH: {
            const columnWidths = state.columnWidths.slice(0);
            columnWidths[action.col] = action.width;
            return { ...state, columnWidths };
        }

        case ActionType.ADD_ROW: {
            const row = new Array(state.columns.length);
            row.fill('');
            const data = state.data.slice(0);
            data.push(row);
            return { ...state, data };
        }

        case ActionType.DELETE_ROW: {
            const data = state.data.slice(0);
            data.splice(action.row, 1);
            return { ...state, data };
        }

        case ActionType.ADD_COLUMN: {
            const columns = state.columns.slice(0);
            columns.push(action.column);

            const columnWidths = state.columnWidths.slice(0);
            columnWidths.push(action.column.width);

            const data = state.data.map(row => row.concat(['']));
            return { ...state, data, columns, columnWidths };
        }

        case ActionType.DELETE_COLUMN: {
            const columns = state.columns.slice(0);
            columns.splice(action.col, 1);

            const columnWidths = state.columnWidths.slice(0);
            columnWidths.splice(action.col, 1);

            const data = state.data.map(row => {
                row = row.slice(0);
                row.splice(action.col, 1);
                return row;
            });

            return { ...state, data, columns, columnWidths };
        }

        default:
            return state;
    }
}

type Props = {
    data: string[][];
    columns: Column[];
}

export default function DataGrid(props: Props): React.ReactElement {
    const params = { data: props.data, columns: props.columns };
    const [state, dispatch] = useReducer(reducer, params, init);

    useEffect(() => {
        if (state.originalData !== props.data || state.originalColumns !== props.columns) {
            dispatch({
                type: ActionType.INIT,
                data: props.data,
                columns: props.columns
            });
        }
    }, [props.data, props.columns, state.originalData, state.originalColumns]);

    return (
        <div className="datagrid">
            <div className="datagrid-scroll">
                <DataGridHeaderGroup
                    columns={state.columns}
                    columnWidths={state.columnWidths}
                    dispatch={dispatch}
                />
                <div className="datagrid-body">
                    {state.data.map((row: string[], index: number) => (
                        <DataGridRow
                            key={index}
                            row={index}
                            columnWidths={state.columnWidths}
                            values={row}
                            dispatch={dispatch}
                        />
                    ))}
                    
                </div>
            </div>
            <DataGridAddRow dispatch={dispatch}/>
        </div>
    );
}
