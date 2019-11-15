import React, { Dispatch, useState } from 'react';
import { Action, ActionType } from './DataGrid';
import InputEditor from './InputEditor';

type Props = {
    col: number;
    row: number;
    value: string;
    columnWidth: number;
    dispatch: Dispatch<Action>;
}

function DataGridCellComponent({ col, row, value, columnWidth, dispatch }: Props): React.ReactElement {
    const [isEditing, setEditing] = useState(false);

    const startEdit = (): void => {
        setEditing(true);
    };

    const onValueChanged = (value: string): void => {
        setEditing(false);
        dispatch({ type: ActionType.SET_CELL_VALUE, col, row, value });
    };

    return (
        <div className="datagrid-cell" style={{ width: columnWidth }}>
            <div className="datagrid-cell-content">
                { isEditing ? (
                    <span onClick={startEdit}>{ value }</span>
                ) : (
                    <InputEditor value={value} onValueChanged={onValueChanged}/>
                )}
            </div>
        </div>
    );
}

const DataGridCell = React.memo(DataGridCellComponent);

type RowProps = {
    row: number;
    values: string[];
    columnWidths: number[];
    dispatch: Dispatch<Action>;
}

function DataGridRowComponent({ row, values, columnWidths, dispatch }: RowProps): React.ReactElement {
    return (
        <div className="datagrid-row">
            {values.map((value, index) => (
                <DataGridCell
                    key={index}
                    row={row}
                    col={index}
                    value={value}
                    columnWidth={columnWidths[index]}
                    dispatch={dispatch}
                />
            ))}
        </div>
    );
}

export const DataGridRow = React.memo(DataGridRowComponent);

