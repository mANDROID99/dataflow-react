import React, { Dispatch, useState } from 'react';
import { Column } from './dataGridTypes';
import { Action } from './DataGrid';
import DataGridResizer from './DataGridResizer';
import Transition from '../common/Transition';
import Overlay from '../common/Overlay';

type DropdownProps = {
    show: boolean;
    onHide: () => void;
}

function DataGridHeaderDropdown({ show, onHide }: DropdownProps): React.ReactElement {
    return (
        <Transition show={show} render={(show, onAnimationEnd): React.ReactElement => {
            return (
                <>
                    { show ? <Overlay onHide={onHide}/> : undefined }
                    <div
                        className="datagrid-header-dropdown"
                        style={{ animation: `${show ? 'slideIn' : 'slideOut'} 0.5s`}}
                        onAnimationEnd={onAnimationEnd}
                    >
                        <div className="datagrid-header-dropdown-item">
                            Edit Column Name
                        </div>
                        <div className="datagrid-header-dropdown-item">
                            Insert Column Right
                        </div>
                        <div className="datagrid-header-dropdown-item">
                            Insert Column Left
                        </div>
                        <div className="datagrid-header-dropdown-item">
                            Delete Column
                        </div>
                    </div>
                </>
            );
        }}/>
    );
}


type Props = {
    col: number;
    column: Column;
    dispatch: Dispatch<Action>;
}

export default function DataGridHeader({ col, column, dispatch }: Props): React.ReactElement {
    const [state, setState] = useState({ editing: false, dropdown: false });

    const toggleDropdown = (): void => {
        setState({ editing: false, dropdown: !state.dropdown });
    };

    const hideDropdown = (): void => {
        setState({ editing: false, dropdown: false });
    }

    return (
        <div
            className="datagrid-header"
            style={{ width: column.width }}
        >
            <div className="datagrid-inner-pad" onClick={toggleDropdown}>
                <span>{column.name}</span>
            </div>
            <DataGridResizer col={col} column={column} dispatch={dispatch}/>
            <DataGridHeaderDropdown onHide={hideDropdown} show={state.dropdown}/>
        </div>
    );
}
