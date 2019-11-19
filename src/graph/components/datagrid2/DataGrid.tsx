import React, { useReducer } from 'react';

import { Column } from './dataGridTypes';
import DataGridHeader from './DataGridHeader';
import DataGridToolbar from './DataGridToolbar';

type Props = {
    columns: Column[];
    data: string[][];
}

type State = {
    originalData: string[][];
    originalColumns: Column[];
    data: string[][];
    columns: Column[];
}

export enum ActionType {
    RESIZE_COLUMN
}

export type Action =
    | { type: ActionType.RESIZE_COLUMN; col: number; width: number };

function init(params: { data: string[][]; columns: Column[] }): State {
    return {
        originalColumns: params.columns,
        originalData: params.data,
        columns: params.columns,
        data: params.data,
    };
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.RESIZE_COLUMN: {
            const columns = state.columns.slice(0);
            columns[action.col] = { ...columns[action.col], width: action.width };
            return { ...state, columns };
        }
        default:
            return state;
    }
}

export default function DataGrid({ columns, data }: Props): React.ReactElement | null {
    const [state, dispatch] = useReducer(reducer, { columns, data }, init);

    return (
        <div className="flex flex-col flex-grow h-full">
            <div className="datagrid">
                <div className="datagrid-headers">
                    {state.columns.map((column, i) => (
                        <DataGridHeader key={i} col={i} column={column} dispatch={dispatch}/>
                    ))}
                </div>
                <div className="datagrid-rows">
                    {state.data.map((row, i) => (
                        <div key={i} className="datagrid-row">
                            <div className="datagrid-row-select">
                                <div className="datagrid-inner-pad">
                                    <input type="checkbox"/>
                                </div>
                            </div>
                            {row.map((cell, j) => {
                                const column = state.columns[j];
                                return (
                                    <div key={j} className="datagrid-cell" style={{ width: column.width }}>
                                        <div className="datagrid-inner-pad">
                                            {cell}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <DataGridToolbar/>
        </div>
    );
}
