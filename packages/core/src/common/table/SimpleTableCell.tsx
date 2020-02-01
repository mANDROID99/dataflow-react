import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Column, CellRenderer } from './simpleTableTypes';
import { CellState, TableAction, setCellSelected, setCellEditing, setCellValue, clickOutsideCell } from './simpleTableReducer';
import { useBufferedInput } from './useBufferedInput';
import { useClickOutside } from '../../utils/hooks/useClickOutside';

type Props = {
    i: number;
    j: number;
    cellState: CellState;
    column: Column;
    dispatch: React.Dispatch<TableAction>;
    renderCell?: CellRenderer;
}

// cell-editor

function SimpleTableCellEditor({ i, j, cellState, column, dispatch }: Props) {
    const onEditorSubmit = (value: unknown) => {
        dispatch(setCellValue(i, j, value));
    }

    const onEditorCancel = () => {
        dispatch(setCellEditing(i, j, false));
    }

    const ref = useRef<any>(null);
    const [input, setInput] = useBufferedInput(ref, cellState.value, onEditorSubmit, onEditorCancel);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return column.editor
        ? column.editor(input, setInput, ref)
        : (
            <input
                className="ngraph-table-value-editor"
                value={toString(input)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                ref={ref}
            />
        );
}

function toString(value: unknown) {
    return value ? '' + value : '';
}

// cell

function SimpleTableCell(props: Props) {
    const { renderCell, cellState, column, i, j, dispatch } = props;
    const ref = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (!cellState.editing) {
            if (cellState.selected && column.editable) {
                dispatch(setCellEditing(i, j, true));

            } else {
                dispatch(setCellSelected(i, j, true));
            }
        }
    }
    
    useClickOutside(ref, props.cellState.selected && !props.cellState.editing ? () => {
        props.dispatch(clickOutsideCell(props.i, props.j));
    } : undefined);

    function renderContent() {
        return renderCell ? renderCell(cellState.value, column) : toString(cellState.value);
    }

    return (
        <div className={cn("ngraph-table-cell", { selected: props.cellState.selected })} onClick={handleClick} ref={ref}>
            {props.cellState.editing ? <SimpleTableCellEditor {...props}/> : renderContent()}
        </div>
    );
}

export default React.memo(SimpleTableCell);
