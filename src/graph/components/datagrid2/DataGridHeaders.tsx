import React, { useState } from 'react';
import { Action, ColumnState, ActionType } from './DataGrid';
import DataGridResizer from './DataGridResizer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGridHeaderDropdown from './DataGridHeaderDropdown';

// type DropdownProps = {
//     show: boolean;
//     onHide: () => void;
// }

// function DataGridHeaderDropdown({ show, onHide }: DropdownProps): React.ReactElement {
//     return (
//         <Transition show={show} render={(show, onAnimationEnd): React.ReactElement => {
//             return (
//                 <>
//                     { show ? <Overlay onHide={onHide}/> : undefined }
//                     <div
//                         className="datagrid-header-dropdown"
//                         style={{ animation: `${show ? 'slideIn' : 'slideOut'} 0.5s`}}
//                         onAnimationEnd={onAnimationEnd}
//                     >
//                         <div className="datagrid-header-dropdown-item">
//                             Edit Column Name
//                         </div>
//                         <div className="datagrid-header-dropdown-item">
//                             Insert Column Right
//                         </div>
//                         <div className="datagrid-header-dropdown-item">
//                             Insert Column Left
//                         </div>
//                         <div className="datagrid-header-dropdown-item">
//                             Delete Column
//                         </div>
//                     </div>
//                 </>
//             );
//         }}/>
//     );
// }


type HeaderProps = {
    col: number;
    column: ColumnState;
    dispatch: React.Dispatch<Action>;
    autoColumn: boolean;
}

function DataGridHeader({ col, column, dispatch, autoColumn }: HeaderProps): React.ReactElement {
    const [state, setState] = useState({ editing: false, dropdown: false });

    const handleToggleDropdown = (): void => {
        setState({ editing: false, dropdown: !state.dropdown });
    };

    const hideDropdown = (): void => {
        setState({ editing: false, dropdown: false });
    };

    return (
        <div className="p-2 py-3 bg-container flex relative sticky top-0">
            <div className="flex-grow">{column.column.name}</div>
            { !autoColumn ? (
                <DataGridResizer
                    col={col}
                    width={column.width}
                    column={column.column}
                    dispatch={dispatch}
                />
            ) : undefined }
            <div className="cursor-pointer px-2" onClick={handleToggleDropdown}>
                <FontAwesomeIcon icon="bars"/>
            </div>
            <DataGridHeaderDropdown
                col={col}
                onHide={hideDropdown}
                show={state.dropdown}
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
            <div className="sticky bg-container p-2 top-0" onClick={handleSelectAll}>
                <input type="checkbox" checked={allSelected}/>
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
    )
}

export default React.memo(DataGridHeaders);
