import React, { useState } from 'react';
import { Action, ColumnState, ActionType } from './DataGrid';
import DataGridResizer from './DataGridResizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGridHeaderDropdown from './DataGridHeaderDropdown';
import TextEditable from './TextEditable';

type HeaderProps = {
    col: number;
    column: ColumnState;
    dispatch: React.Dispatch<Action>;
    autoColumn: boolean;
}

function DataGridHeader({ col, column, dispatch, autoColumn }: HeaderProps): React.ReactElement {
    const [showDropdown, setShowDropdown] = useState(false);

    const handleToggleDropdown = (): void => {
        setShowDropdown(!showDropdown);
    };

    const handleNameChanged = (value: string): void => {
        dispatch({ type: ActionType.CHANGE_COLUMN_HEADER, col, value });
    };
    
    return (
        <div className="datagrid-header">
            <div className="datagrid-header-dropdown-icon" onClick={handleToggleDropdown}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <div className="datagrid-header-title">
                <TextEditable onChange={handleNameChanged} value={column.name} dark/>
            </div>
            { !autoColumn ? (
                <DataGridResizer
                    col={col}
                    width={column.width}
                    column={column.column}
                    dispatch={dispatch}
                />
            ) : undefined }
            <DataGridHeaderDropdown
                col={col}
                onHide={handleToggleDropdown}
                show={showDropdown}
                dispatch={dispatch}
            />
        </div>
    );
}

type Props = {
    allSelected: boolean;
    columns: ColumnState[];
    dispatch: React.Dispatch<Action>;
}

function DataGridHeaders({ allSelected, columns, dispatch }: Props) {

    const handleSelectAll = () => {
        dispatch({ type: ActionType.TOGGLE_SELECT_ALL });
    }

    return (
        <div className="datagrid-headers">
            <div className="datagrid-header" onClick={handleSelectAll}>
                <input type="checkbox" checked={allSelected} readOnly/>
            </div>
            {columns.map((column, i) => (
                <DataGridHeader
                    key={i}
                    col={i}
                    column={column}
                    dispatch={dispatch}
                    autoColumn={i >= columns.length - 1}
                />
            ))}
        </div>
    );
}

export default React.memo(DataGridHeaders);
