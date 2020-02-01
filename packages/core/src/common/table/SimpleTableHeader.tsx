import React, { useRef, useState, useLayoutEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faBars);

import { TableAction, ColumnState, moveColumn, insertColumnAfter, insertColumnBefore, deleteColumn, setColumnNameEditing, setColumnName } from './simpleTableReducer';
import { Column } from './simpleTableTypes';

import { MenuConfig } from '../dropdown/dropdownTypes';
import SimpleTableHeaderRezizer from './SimpleTableHeaderResizer';
import SimpleTableValueEditor from './SimpleTableValueEditor';
import Tooltip from '../Tooltip';
import DropdownMenu from '../dropdown/DropdownMenu';

type Props = {
    index: number;
    numCols: number;
    column: Column;
    columnState: ColumnState;
    dispatch: React.Dispatch<TableAction>;
}

type DragState = {
    mouseX: number;
};

const CLICK_GUARD_DIST = 3;

function createMenu(index: number, nCols: number, dispatch: React.Dispatch<TableAction>): MenuConfig {
    return {
        title: 'Column',
        options: [
            {
                label: 'Edit Name',
                action: () => {
                    dispatch(setColumnNameEditing(index, true));
                }
            },
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
                disabled: nCols <= 1,
                action: () => {
                    dispatch(deleteColumn(index));
                }
            }
        ]
    }
}

function SimpleTableHeader({ index, numCols, column, columnState, dispatch }: Props) {
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
            if (dx < 0 && index === 0) {
                dx = 0;
                
            } else if (dx > 0 && index === numCols - 1) {
                dx = 0;
            }

            el.style.transform = `translate(${dx}px, 0)`;
            const halfw = ref.current!.offsetWidth;

            if (dx > halfw) {
                drag.mouseX = event.clientX;
                dispatch(moveColumn(index, index + 1));

            } else if (dx < -halfw) {
                drag.mouseX = event.clientX;
                dispatch(moveColumn(index, index - 1));
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
    }, [drag, index]);

    const handleDragStart = (event: React.MouseEvent) => {
        clickGuard.current = false;
        setDrag({ mouseX: event.clientX });
    };

    const handleShowMenu = () => {
        if (!clickGuard.current) {
            setShowMenu(!showMenu);
        }
    };

    const handleHideMenu = () => {
        setShowMenu(false);
    };
    
    const handeColumnNameChanged = (value: string) => {
        dispatch(setColumnName(index, value));
    };

    const handleColumnNameEditCancelled = () => {
        dispatch(setColumnNameEditing(index, false));
    }

    return (
        <div ref={ref} className={cn("ngraph-table-header", { dragging: drag != null })}>
            {columnState.editing ? (
                <SimpleTableValueEditor
                    value={column.name}
                    onChange={handeColumnNameChanged}
                    onCancel={handleColumnNameEditCancelled}
                />
            ) : (
                <div className="ngraph-table-header-text">
                    {column.name}
                </div>
            )}
            <div  ref={handleRef} className="ngraph-table-header-handle" onMouseDown={handleDragStart} onClick={handleShowMenu}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <SimpleTableHeaderRezizer
                index={index}
                dispatch={dispatch}
                column={column}
                columnState={columnState}
            />
            <Tooltip
                show={showMenu}
                onHide={handleHideMenu}
                target={handleRef}>
                {() => (
                    <DropdownMenu
                        menu={createMenu(index, numCols, dispatch)}
                        onHide={handleHideMenu}
                    />
                )}
            </Tooltip>
        </div>
    );
}

export default React.memo(SimpleTableHeader);
