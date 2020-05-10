import React, { useContext } from 'react';
import { RowRendererProps, Row as GridRow, Cell as GridCell, CellRendererProps } from 'react-data-grid';
import { gridContext } from './context';
import { ActionType } from './editableDataGridReducer';

function EditableDataGridCell(props: CellRendererProps<string[]>) {
    const { dispatch } = useContext(gridContext);

    return (
        <GridCell
            {...props}
            onContextMenu={(e) => {
                e.preventDefault();
                const x = e.clientX;
                const y = e.clientY;

                dispatch({
                    type: ActionType.SHOW_ROW_MENU,
                    row: props.rowIdx,
                    x, y
                });
            }}
        />
    );
}

export default function EditableDataGridRow(rowProps: RowRendererProps<string[]>) {
    return (
        <GridRow
            {...rowProps}
            cellRenderer={EditableDataGridCell}
        />
    )
}
