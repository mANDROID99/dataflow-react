import React, { useRef, useState, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faBars);

import { TableAction, ColumnState, setColumnSelected, moveColumn } from './simpleTableReducer';
import SimpleTableHeaderRezizer from './SimpleTableHeaderResizer';

type Props = {
    index: number;
    numCols: number;
    columnState: ColumnState;
    dispatch: React.Dispatch<TableAction>;
}

type DragState = {
    mouseX: number;
};

function SimpleTableHeader(props: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<DragState>();

    useLayoutEffect(() => {
        if (!drag) return;

        const handleDrag = (event: MouseEvent) => {
            const el = ref.current!;
            let dx = event.clientX - drag.mouseX;

            // clamp
            if (dx < 0 && props.index === 0) {
                dx = 0;
                
            } else if (dx > 0 && props.index === props.numCols - 1) {
                dx = 0;
            }

            el.style.transform = `translate(${dx}px, 0)`;
            const halfw = ref.current!.offsetWidth;

            if (dx > halfw) {
                drag.mouseX = event.clientX;
                props.dispatch(moveColumn(props.index, props.index + 1));

            } else if (dx < -halfw) {
                drag.mouseX = event.clientX;
                props.dispatch(moveColumn(props.index, props.index - 1));
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
        setDrag({ mouseX: event.clientX });
    };

    const onChangeSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch(setColumnSelected(props.index, event.target.checked));
    }

    return (
        <div ref={ref} className={cn("ngraph-table-header", { dragging: drag != null })}>
            <div className="ngraph-table-header-text">
                {props.columnState.column.name}
            </div>
            <div className="ngraph-table-header-handle" onMouseDown={handleDragStart}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <SimpleTableHeaderRezizer
                index={props.index}
                dispatch={props.dispatch}
                columnState={props.columnState}
            />
        </div>
    );
}

export default React.memo(SimpleTableHeader);
