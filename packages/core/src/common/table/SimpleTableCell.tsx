import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Column, CellRenderer } from './simpleTableTypes';
import { CellState, TableAction, setCellSelected, setCellEditing, setCellValue } from './simpleTableReducer';
import SimpleTableValueEditor from './SimpleTableValueEditor';
import { isDeepAncestor } from '../../utils/domUtils';

type Props = {
    i: number;
    j: number;
    value: unknown;
    cellState: CellState;
    column: Column;
    dispatch: React.Dispatch<TableAction>;
    renderCell?: CellRenderer<any>;
}

function toString(value: unknown) {
    return value ? '' + value : '';
}

function SimpleTableCell({
    renderCell,
    value,
    cellState,
    column,
    i,
    j,
    dispatch
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    // clear the selection when click outside 
    useEffect(() => {
        if (!cellState.selected) return;

        const handleMouseDown = (e: MouseEvent) => {
            if (!isDeepAncestor(e.target as HTMLElement, ref.current!)) {
                dispatch(setCellSelected(i, j, false));
            }
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        }
    }, [cellState.selected, dispatch, i, j]);

    const handleClick = () => {
        if (!cellState.editing) {
            if (cellState.selected) {
                if (column.editable) {
                    dispatch(setCellEditing(i, j, true));
                }

            } else {
                dispatch(setCellSelected(i, j, true));
            }
        }
    }

    const handleValueChanged = (value: unknown) => {
        dispatch(setCellValue(i, j, value));
    }

    const handleEditorCancelled = () => {
        dispatch(setCellEditing(i, j, false));
    }

    function renderEditor() {
        return column.editor ? column.editor(value, handleValueChanged) : (
            <SimpleTableValueEditor
                value={value as any}
                onChange={handleValueChanged}
                onCancel={handleEditorCancelled}
            />
        );
    }

    function renderContent() {
        return renderCell ? renderCell(value, column) : toString(value);
    }

    return (
        <div className={cn("ngraph-table-cell", { selected: cellState.selected })} onClick={handleClick} ref={ref}>
            {cellState.editing ? renderEditor() : renderContent()}
        </div>
    );
}

export default React.memo(SimpleTableCell);
