import React, { useState } from 'react';
import { Column } from "./dataGridTypes";
import { Action } from './DataGrid';
import DataGridResizer from './DataGridResizer';

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
    column: Column;
    dispatch: React.Dispatch<Action>;
    autoColumn: boolean;
}

function DataGridHeader({ col, column, dispatch, autoColumn }: HeaderProps): React.ReactElement {
    const [state, setState] = useState({ editing: false, dropdown: false });

    const toggleDropdown = (): void => {
        setState({ editing: false, dropdown: !state.dropdown });
    };

    const hideDropdown = (): void => {
        setState({ editing: false, dropdown: false });
    }

    return (
        <div className="p-2 py-3 bg-container relative sticky top-0">
            <div className="datagrid-header-label">{column.name}</div>
            { !autoColumn ? <DataGridResizer col={col} column={column} dispatch={dispatch}/> : undefined }
            {/* <DataGridHeaderDropdown onHide={hideDropdown} show={state.dropdown}/> */}
        </div>
    );
}

type Props = {
    columns: Column[];
    dispatch: React.Dispatch<Action>;
}

function DataGridHeaders({ columns, dispatch }: Props) {
    return (
        <div className="datagrid-headers">
            <div className="sticky bg-container p-2 top-0">
                <input type="checkbox"/>
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
