import React, { useReducer, useMemo } from 'react';

import { Column } from './dataGridTypes';
import DataGridToolbar from './DataGridToolbar';
import DataGridHeaders from './DataGridHeaders';
import DataGridBody from './DataGridBody';

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
    RESIZE_COLUMN,
    CHANGE_CELL_VALUE
}

export type Action =
    | { type: ActionType.RESIZE_COLUMN; col: number; width: number }
    | { type: ActionType.CHANGE_CELL_VALUE; col: number; row: number; value: string };

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

        case ActionType.CHANGE_CELL_VALUE: {
            const data = state.data.slice(0);

            const row = data[action.row] = data[action.row].slice(0);
            row[action.col] = action.value;

            return { ...state, data };
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

    return (
        <div className="datagrid-container">
            <div className="datagrid" style={{ gridTemplateColumns }}>
                <DataGridHeaders columns={state.columns} dispatch={dispatch}/>
                <DataGridBody data={state.data} dispatch={dispatch}/>
            </div>
            <DataGridToolbar/>
        </div>
    );
}
