import React, { useState, useMemo } from 'react';

import DataGridResizer from './DataGridResizer';
import Dropdown, { DropdownAction } from '../../common/Dropdown';
import { Action, ActionType, ColumnState } from './dataGridReducer';
import CommonTextInput from '../../common/CommonTextInput';

type HeaderProps = {
    col: number;
    columnState: ColumnState;
    dispatch: React.Dispatch<Action>;
    last: boolean;
}

function createDropdownActions(col: number, dispatch: React.Dispatch<Action>): DropdownAction[] {
    return [
        {
            label: 'Edit Column',
            action() {
                dispatch({ type: ActionType.EDIT_COLUMN_NAME, col });
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
        },
        {
            label: 'Delete Column',
            action() {
                dispatch({ type: ActionType.DELETE_COLUMN, col });
            }
        }
    ];
}

function DataGridHeader(props: HeaderProps): React.ReactElement {
    const { col, columnState, dispatch, last } = props;
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
        <div className="ngraph-datagrid-table-header">
            {columnState.editing ? (
                <CommonTextInput
                    className="ngraph-datagrid-table-header-input"
                    value={columnState.name}
                    onChange={handleNameChanged}
                    focus
                />
            ) : (
                <div
                    className="ngraph-datagrid-table-header-text"
                    onClick={handleToggleMenu}
                >
                    {columnState.name || '-'}
                </div>
            )}
            { !last ? <DataGridResizer
                col={col}
                width={columnState.width}
                dispatch={dispatch}
            /> : undefined }
            <Dropdown
                show={isShowMenu}
                actions={dropdownActions}
                onHide={handleToggleMenu}
            />
        </div>
    );
}

export default React.memo(DataGridHeader);
