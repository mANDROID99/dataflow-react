import React, { useRef, useLayoutEffect, useState } from 'react';
import cn from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faBars);

import { TableAction, setRowSelected, RowState, moveRow } from './simpleTableReducer';

type Props = {
    index: number;
    numRows: number;
    rowState: RowState;
    dispatch: React.Dispatch<TableAction>;
}

type DragState = {
    mouseY: number;
};

function renderCell(value: unknown) {
    return !value ? '' : '' + value;
}

function SimpleTableRow(props: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<DragState>();

    useLayoutEffect(() => {
        if (!drag) return;

        const handleDrag = (event: MouseEvent) => {
            const el = ref.current!;
            let dy = event.clientY - drag.mouseY;

            // clamp
            if (dy < 0 && props.index === 0) {
                dy = 0;
                
            } else if (dy > 0 && props.index === props.numRows - 1) {
                dy = 0;
            }

            el.style.transform = `translate(0,${dy}px)`;
            const halfh = ref.current!.offsetHeight;

            if (dy > halfh) {
                drag.mouseY = event.clientY;
                props.dispatch(moveRow(props.index, props.index + 1));

            } else if (dy < -halfh) {
                drag.mouseY = event.clientY;
                props.dispatch(moveRow(props.index, props.index - 1));
            }
        }

        const handleMouseUp = () => {
            setDrag(undefined);
        }

        window.addEventListener('mousemove', handleDrag);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            ref.current!.style.transform = null as any;
            window.removeEventListener('mousemove', handleDrag);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [drag, props.index]);

    const handleDragStart = (event: React.MouseEvent) => {
        setDrag({ mouseY: event.clientY });
    };

    const handleSelectedChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch(setRowSelected(props.index, event.target.checked));
    };

    return (
        <div className={cn("ngraph-table-row", { dragging: drag != null })}>
            <div ref={ref} className="ngraph-table-cell ngraph-table-row-handle" onMouseDown={handleDragStart}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            {props.rowState.values.map((value, i) => (
                <div className="ngraph-table-cell" key={i}>
                    {renderCell(value)}
                </div>
            ))}
            <div className="ngraph-table-cell"/>
        </div>
    );
}

export default React.memo(SimpleTableRow);
