import React, { useState, useEffect } from 'react';
import { TableAction, resizeColumn, ColumnState } from './simpleTableReducer';

type Props = {
    index: number;
    columnState: ColumnState;
    dispatch: React.Dispatch<TableAction>;
}

type DragState = {
    width: number;
    mouseX: number;
}

function SimpleTableHeaderResizer(props: Props) {
    const { index, columnState, dispatch } = props;
    const minWidth = columnState.column.minWidth;
    const maxWidth = columnState.column.maxWidth;

    const [dragState, setDragState] = useState<DragState>();

    useEffect(() => {
        if (dragState) {
            const handleMouseMove = (event: MouseEvent) => {
                const dx = event.clientX - dragState.mouseX;
                let w = dragState.width + dx;

                if (minWidth != null && w < minWidth) {
                    w = minWidth;
                }

                if (maxWidth != null && w > maxWidth) {
                    w = maxWidth;
                }

                dispatch(resizeColumn(index, w));
            }

            const handleMouseUp = () => {
                setDragState(undefined);
            }

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        }
    }, [dragState, minWidth, maxWidth, dispatch]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragState({
            mouseX: e.clientX,
            width: columnState.width
        });
    }

    return (
        <div className="ngraph-table-header-resizer" onMouseDown={handleMouseDown}/>
    );
}

export default SimpleTableHeaderResizer;
