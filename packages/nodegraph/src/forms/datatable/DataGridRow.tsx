import React from 'react';
import cn from 'classnames';

import { Action, ActionType, RowState } from './dataGridReducer';
import DataGridCell from './DataGridCell';

type RowProps = {
    row: number;
    rowState: RowState;
    dispatch: React.Dispatch<Action>;
}

function DataGridRow({ row, rowState, dispatch }: RowProps) {
    
    const handleToggleSelected = () => {
        dispatch({ type: ActionType.TOGGLE_ROW_SELECTION, row });
    };

    return (
        <div className={cn("ngraph-datagrid-table-row", { selected: rowState.selected })}>
            <div className="ngraph-datagrid-table-cell">
                <input type="checkbox" checked={rowState.selected} onChange={handleToggleSelected}/>
            </div>
            {rowState.values.map((cell, i) => {
                return (
                    <DataGridCell
                        key={i}
                        col={i}
                        row={row}
                        value={cell}
                        dispatch={dispatch}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(DataGridRow);
