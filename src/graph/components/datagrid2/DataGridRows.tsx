import React from 'react';
import { Action, RowState, ActionType } from './DataGrid';
import TextEditable from './TextEditable';

type RowProps = {
    rowNo: number;
    row: RowState;
    dispatch: React.Dispatch<Action>;
}

function DataGridRow({ rowNo, row, dispatch }: RowProps) {

    const handleRowSelected = () => {
        dispatch({ type: ActionType.TOGGLE_SELECT_ROW, row: rowNo });
    };

    const handleCellValueChanged = (col: number) => (value: string) => {
        dispatch({ type: ActionType.CHANGE_CELL_VALUE, row: rowNo, col, value });
    };

    return (
        <div className="datagrid-row">
            <div className="bg-inherit p-2" onClick={handleRowSelected}>
                <input type="checkbox" checked={row.selected} readOnly/>
            </div>
            {row.values.map((cell, i) => {
                return (
                    <div key={i} className="datagrid-cell">
                        <TextEditable value={cell} onChange={handleCellValueChanged(i)}/>
                    </div>
                );
            })}
        </div>
    );
}

const Row = React.memo(DataGridRow);

type Props = {
    rows: RowState[];
    dispatch: React.Dispatch<Action>;
}

function DataGridRows({ rows, dispatch }: Props) {
    return (
        <div className="datagrid-body">
            {rows.map((row, i) => (
                <Row key={i} rowNo={i} row={row} dispatch={dispatch} />
            ))}
        </div>
    );
}

export default DataGridRows;
