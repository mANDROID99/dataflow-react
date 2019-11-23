import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Action, ColumnState, ActionType } from './DataGrid';
import DataGridResizer from './DataGridResizer';
import TextEditable from './TextEditable';
import Dropdown, { DropdownAction } from '../common/Dropdown';

type HeaderProps = {
    col: number;
    column: ColumnState;
    dispatch: React.Dispatch<Action>;
}

function createDropdownActions(col: number, dispatch: React.Dispatch<Action>): DropdownAction[] {
    return [
        {
            label: 'Delete Column',
            action() {
                dispatch({ type: ActionType.DELETE_COLUMN, col });
            }
        },
        {
            label: 'Insert Before',
            action() {
                dispatch({ type: ActionType.INSERT_COLUMN_BEFORE, col });
            }
        },
        {
            label: 'Insert After',
            action() {
                dispatch({ type: ActionType.INSERT_COLUMN_AFTER, col });
            }
        }
    ];
}

function DataGridHeader({ col, column, dispatch }: HeaderProps): React.ReactElement {
    const [isShowMenu, setShowMenu] = useState(false);

    const dropdownActions = useMemo(() => {
        return createDropdownActions(col, dispatch);
    }, [col, dispatch]);

    const handleToggleMenu = () => {
        setShowMenu(!isShowMenu);
    };

    const handleNameChanged = (value: string): void => {
        dispatch({ type: ActionType.CHANGE_COLUMN_HEADER, col, value });
    };
    
    return (
        <div className="datagrid-header">
            <div className="datagrid-header-dropdown-icon" onClick={handleToggleMenu}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <div className="datagrid-header-title">
                <TextEditable onChange={handleNameChanged} value={column.name} dark/>
            </div>
            <DataGridResizer
                col={col}
                width={column.width}
                column={column.column}
                dispatch={dispatch}
            />
            <Dropdown show={isShowMenu} actions={dropdownActions} onHide={handleToggleMenu}/>
        </div>
    );
}

type Props = {
    columns: ColumnState[];
    dispatch: React.Dispatch<Action>;
}

function DataGridHeaders({ columns, dispatch }: Props) {
    return (
        <div className="datagrid-headers">
            {columns.map((column, i) => (
                <DataGridHeader
                    key={i}
                    col={i}
                    column={column}
                    dispatch={dispatch}
                />
            ))}
            <div className="datagrid-header"/>
        </div>
    );
}

export default React.memo(DataGridHeaders);
