import React, { useRef, useLayoutEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faBars);

import { CellRenderer, Column } from './simpleTableTypes';
import { TableAction, RowState, moveRow, insertRowBefore, insertRowAfter, deleteRow } from './simpleTableReducer';
import { MenuConfig } from '../dropdown/dropdownTypes';
import SimpleTableCell from './SimpleTableCell';
import DropdownMenu from '../dropdown/DropdownMenu';
import Tooltip from '../Tooltip';

type Props = {
    index: number;
    numRows: number;
    row: unknown[];
    rowState: RowState;
    columns: Column[];
    dispatch: React.Dispatch<TableAction>;
    renderCell?: CellRenderer<any>;
}

type DragState = {
    mouseY: number;
};

const CLICK_GUARD_DIST = 3;

function createMenu(index: number, nRows: number, dispatch: React.Dispatch<TableAction>): MenuConfig {
    return {
        title: 'Row',
        options: [
            {
                label: 'Insert Before',
                action: () => {
                    dispatch(insertRowBefore(index));
                }
            },
            {
                label: 'Insert After',
                action: () => {
                    dispatch(insertRowAfter(index));
                }
            },
            {
                label: 'Delete',
                disabled: nRows <= 1,
                action: () => {
                    dispatch(deleteRow(index));
                }
            }
        ]
    }
}

function SimpleTableRow({
    index,
    numRows,
    row,
    rowState,
    columns,
    dispatch,
    renderCell
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const [drag, setDrag] = useState<DragState>();
    const [showMenu, setShowMenu] = useState(false);
    const clickGuard = useRef(false);

    useLayoutEffect(() => {
        if (!drag) return;

        const handleDrag = (event: MouseEvent) => {
            const el = ref.current!;
            let dy = event.clientY - drag.mouseY;

            // don't register click when dragged further than a certain distance
            if (Math.abs(dy) > CLICK_GUARD_DIST) {
                clickGuard.current = true;
            }

            // clamp
            if (dy < 0 && index === 0) {
                dy = 0;
                
            } else if (dy > 0 && index === numRows - 1) {
                dy = 0;
            }

            el.style.transform = `translate(0,${dy}px)`;
            const halfh = ref.current!.offsetHeight;

            if (dy > halfh) {
                drag.mouseY = event.clientY;
                dispatch(moveRow(index, index + 1));

            } else if (dy < -halfh) {
                drag.mouseY = event.clientY;
                dispatch(moveRow(index, index - 1));
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
    }, [drag, index, numRows]);

    const handleDragStart = (event: React.MouseEvent) => {
        clickGuard.current = false;
        setDrag({ mouseY: event.clientY });
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
    
    return (
        <div className="ngraph-table-row">
            <div ref={ref} className="ngraph-table-cell ngraph-table-row-handle" onMouseDown={handleDragStart} onClick={handleShowMenu}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            {rowState.cells.map((cellState, j) => (
                <SimpleTableCell
                    key={j}
                    i={index}
                    j={j}
                    renderCell={renderCell}
                    cellState={cellState}
                    value={row[j]}
                    column={columns[j]}
                    dispatch={dispatch}
                />
            ))}
            <div className="ngraph-table-cell"/>
            <Tooltip
                target={ref}
                show={showMenu}
                options={{ placement: 'right' }}
                onHide={handleHideMenu}
            >
                {() => (
                    <DropdownMenu
                        onHide={handleHideMenu}
                        menu={createMenu(index, numRows, dispatch)}
                    />
                )}
            </Tooltip>
        </div>
    );
}

export default React.memo(SimpleTableRow);
