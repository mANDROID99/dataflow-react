import React, { useRef, useState, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faBars);

import { TableAction, ColumnState, setColumnSelected, moveColumn, insertRowBefore, insertColumnAfter, insertColumnBefore, deleteColumn } from './simpleTableReducer';
import SimpleTableHeaderRezizer from './SimpleTableHeaderResizer';
import Dropdown from '../dropdown/Dropdown';
import { MenuConfig } from '../dropdown/dropdownTypes';

type Props = {
    index: number;
    numCols: number;
    columnState: ColumnState;
    dispatch: React.Dispatch<TableAction>;
}

type DragState = {
    mouseX: number;
};

const CLICK_GUARD_DIST = 3;

function createMenu(index: number, dispatch: React.Dispatch<TableAction>): MenuConfig {
    return {
        title: 'Column',
        options: [
            {
                label: 'Insert Before',
                action: () => {
                    dispatch(insertColumnBefore(index));
                }
            },
            {
                label: 'Insert After',
                action: () => {
                    dispatch(insertColumnAfter(index));
                }
            },
            {
                label: 'Delete',
                action: () => {
                    dispatch(deleteColumn(index));
                }
            }
        ]
    }
}

function SimpleTableHeader(props: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<DragState>();
    const [showMenu, setShowMenu] = useState(false);
    const clickGuard = useRef(false);

    useLayoutEffect(() => {
        if (!drag) return;

        const handleDrag = (event: MouseEvent) => {
            const el = ref.current!;
            let dx = event.clientX - drag.mouseX;

            // don't register click when dragged further than a certain distance
            if (Math.abs(dx) > CLICK_GUARD_DIST) {
                clickGuard.current = true;
            }

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
        clickGuard.current = false;
        setDrag({ mouseX: event.clientX });
    };

    const handleShowMenu = () => {
        if (!clickGuard.current) {
            console.log('click');
            setShowMenu(!showMenu);
        }
    };

    const handleHideMenu = () => {
        setShowMenu(false);
    };

    const onChangeSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch(setColumnSelected(props.index, event.target.checked));
    }

    return (
        <div ref={ref} className={cn("ngraph-table-header", { dragging: drag != null })}>
            <div className="ngraph-table-header-text">
                {props.columnState.column.name}
            </div>
            <div  ref={handleRef} className="ngraph-table-header-handle" onMouseDown={handleDragStart} onClick={handleShowMenu}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <SimpleTableHeaderRezizer
                index={props.index}
                dispatch={props.dispatch}
                columnState={props.columnState}
            />
            <Dropdown
                placement="bottom"
                show={showMenu}
                onHide={handleHideMenu}
                target={handleRef}
                menu={createMenu.bind(null, props.index, props.dispatch)}
            />
        </div>
    );
}

export default React.memo(SimpleTableHeader);
