import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Action, ActionType } from './DataGrid';
import TextEditable from './TextEditable';
import Dropdown, { DropdownAction } from '../common/Dropdown';

type RowProps = {
    rowNo: number;
    row: string[];
    dispatch: React.Dispatch<Action>;
}

function createDropdownActions(row: number, dispatch: React.Dispatch<Action>): DropdownAction[] {
    return [
        {
            label: 'Delete Row',
            action() {
                dispatch({ type: ActionType.DELETE_ROW, row });
            }
        },
        {
            label: 'Insert Before',
            action() {
                dispatch({ type: ActionType.INSERT_ROW_BEFORE, row });
            }
        },
        {
            label: 'Insert After',
            action() {
                dispatch({ type: ActionType.INSERT_ROW_AFTER, row });
            }
        }
    ];
}

function DataGridRow({ rowNo, row, dispatch }: RowProps) {
    const [isSelected, setSelected] = useState(false);
    const [isShowMenu, setShowMenu] = useState(false);

    const dropdownActions = useMemo(() => {
        return createDropdownActions(rowNo, dispatch);
    }, [rowNo, dispatch]);

    const handleMouseOver = () => {
        setSelected(true);
    };

    const handleMouseOut = () => {
        setSelected(false);
    };

    const handleToggleMenu = () => {
        setShowMenu(!isShowMenu);
    };

    const handleCellValueChanged = (col: number) => (value: string) => {
        dispatch({ type: ActionType.CHANGE_CELL_VALUE, row: rowNo, col, value });
    };

    return (
        <div className="datagrid-row" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {row.map((cell, i) => {
                return (
                    <div key={i} className="datagrid-cell">
                        <TextEditable value={cell} onChange={handleCellValueChanged(i)}/>
                    </div>
                );
            })}
            <div className="datagrid-cell">
                <div className="datagrid-row-actions" onClick={handleToggleMenu}>
                    <FontAwesomeIcon icon="bars" style={{ visibility: isSelected ? 'visible' : 'hidden' }} />
                    <Dropdown right show={isShowMenu} actions={dropdownActions} onHide={handleToggleMenu}/>
                </div>
            </div>
        </div>
    );
}

const Row = React.memo(DataGridRow);

type Props = {
    rows: string[][];
    dispatch: React.Dispatch<Action>;
}

function DataGridRows({ rows, dispatch }: Props) {
    return (
        <div className="datagrid-body">
            {rows.map((row, i) => (
                <Row key={i} rowNo={i} row={row} dispatch={dispatch} />
            ))}
        </div>
    );
}

export default DataGridRows;
