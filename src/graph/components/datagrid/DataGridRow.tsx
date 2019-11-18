import React, { Dispatch } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Action, ActionType } from './DataGrid';
import InputEditor from './InputEditor';

type Props = {
    col: number;
    row: number;
    value: string;
    columnWidth: number;
    last: boolean;
    dispatch: Dispatch<Action>;
}

function DataGridCellComponent({ col, row, value, columnWidth, last, dispatch }: Props): React.ReactElement {
    const onValueChanged = (value: string): void => {
        dispatch({ type: ActionType.SET_CELL_VALUE, col, row, value });
    };

    return (
        <div className={classNames("datagrid-cell", { grow: last })} style={{ width: columnWidth, minWidth: columnWidth }}>
            <div className="datagrid-cell-content">
                <InputEditor value={value} onValueChanged={onValueChanged}/>
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
    const removeRow = (): void => {
        dispatch({ type: ActionType.DELETE_ROW, row });
    };

    return (
        <div className="datagrid-row">
            <div className="datagrid-cell datagrid-cell-dark">
                <div className="datagrid-cell-content">
                    <div className="datagrid-action-btn" onClick={removeRow}>
                        <FontAwesomeIcon icon="times"/>
                    </div>
                </div>
            </div>
            {values.map((value, index) => (
                <DataGridCell
                    key={index}
                    row={row}
                    col={index}
                    value={value}
                    columnWidth={columnWidths[index]}
                    last={index === values.length - 1}
                    dispatch={dispatch}
                />
            ))}
        </div>
    );
}

export const DataGridRow = React.memo(DataGridRowComponent);

