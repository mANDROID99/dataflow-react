import React from 'react';
import { Action, ActionType } from "./DataGrid";
import Transition from '../common/Transition';
import Overlay from '../common/Overlay';

type Props = {
    col: number;
    show: boolean;
    dispatch: React.Dispatch<Action>;
    onHide: () => void;
}

export default function DataGridHeaderDropdown({ col, show, dispatch, onHide }: Props) {

    const handleDeleteColumn = () => {
        onHide();
        dispatch({ type: ActionType.DELETE_COLUMN, col });
    };

    const handleInsertAfter = () => {
        onHide();
        dispatch({ type: ActionType.INSERT_COLUMN_AFTER, col });
    };

    const handleInsertBefore = () => {
        onHide();
        dispatch({ type: ActionType.INSERT_COLUMN_BEFORE, col });
    };

    return (
        <Transition show={show} render={(show, onAnimationEnd) => (
            <>
                { show ? <Overlay onHide={onHide} /> : undefined }
                <div
                    className="dropdown-container"
                    style={{ animation: (show ? 'slideIn' : 'slideOut') + ' 0.25s' }}
                    onAnimationEnd={onAnimationEnd}
                >
                    <div className="menu-item" onClick={handleDeleteColumn}>Delete Column</div>
                    <div className="menu-item" onClick={handleInsertBefore}>Insert Column Before</div>
                    <div className="menu-item" onClick={handleInsertAfter}>Insert Column After</div>
                </div>
            </>
        )}/>        
    );
}


