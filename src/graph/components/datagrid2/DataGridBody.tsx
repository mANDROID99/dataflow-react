import React, { useState } from 'react';
import DataGridCell from './DataGridCell';
import { Action } from './DataGrid';
import DataGridContextMenu from './DataGridContextMenu';

type RowProps = {
    row: number;
    data: string[];
    dispatch: React.Dispatch<Action>;
}

function DataGridRow({ row, data, dispatch }: RowProps) {
    return (
        <div className="datagrid-row">
            <div className="bg-inherit p-2">
                <input type="checkbox"/>
            </div>
            {data.map((cell, i) => {
                return (
                    <DataGridCell
                        key={i}
                        row={row}
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
    data: string[][];
    dispatch: React.Dispatch<Action>;
}

function DataGridBody({ data, dispatch }: Props) {
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
            {data.map((row, i) => (
                <Row key={i} row={i} data={row} dispatch={dispatch} />
            ))}
            <DataGridContextMenu mousePos={showContextMenu} onHide={handleHideContextMenu} />
        </div>
    );
}

export default DataGridBody;
