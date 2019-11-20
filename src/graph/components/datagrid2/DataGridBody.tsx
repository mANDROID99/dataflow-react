import React, { useState } from 'react';
import DataGridCell from './DataGridCell';
import { Action, RowState, ActionType } from './DataGrid';
import DataGridContextMenu from './DataGridContextMenu';

type RowProps = {
    rowNo: number;
    row: RowState;
    dispatch: React.Dispatch<Action>;
}

function DataGridRow({ rowNo, row, dispatch }: RowProps) {

    const handleRowSelected = () => {
        dispatch({ type: ActionType.TOGGLE_SELECT_ROW, row: rowNo });
    };

    return (
        <div className="datagrid-row">
            <div className="bg-inherit p-2" onClick={handleRowSelected}>
                <input type="checkbox" checked={row.selected}/>
            </div>
            {row.values.map((cell, i) => {
                return (
                    <DataGridCell
                        key={i}
                        row={rowNo}
                        col={i}
                        value={cell}
                        dispatch={dispatch}
                        // isAuto={i === data.length - 1}
                    />
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

function DataGridBody({ rows, dispatch }: Props) {
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

    return (
        <div className="datagrid-body" onContextMenu={handleShowContextMenu}>
            {rows.map((row, i) => (
                <Row key={i} rowNo={i} row={row} dispatch={dispatch} />
            ))}
            <DataGridContextMenu
                mousePos={showContextMenu}
                onHide={handleHideContextMenu}
                dispatch={dispatch}
            />
        </div>
    );
}

export default DataGridBody;
