import React from 'react';
import { Action, ActionType } from './dataGridReducer';
import Overlay from '../../common/Overlay';

type Props = {
    show: boolean;
    x: number;
    y: number;
    dispatch: React.Dispatch<Action>;
}

function DataGridContextMenu(props: Props) {
    const { show, x, y, dispatch } = props;

    const handleHide = () => {
        dispatch({ type: ActionType.HIDE_CONTEXT_MENU });
    };

    const handleDeleteRows = () => {
        dispatch({ type: ActionType.DELETE_SELECTED_ROWS });
    };

    const handleInsertRowsBefore = () => {
        dispatch({ type: ActionType.INSERT_ROW_BEFORE_SELECTED });
    };

    const handleInsertRowsAfter = () => {
        dispatch({ type: ActionType.INSERT_ROW_AFTER_SELECTED });
    };

    if (show) {
        return (
            <Overlay onHide={handleHide}>
                <div className="ngraph-contextmenu" style={{ left: x, top: y }}>
                    <div className="ngraph-contextmenu-header">Menu</div>
                    <div className="ngraph-contextmenu-item" onClick={handleDeleteRows}>Delete Rows</div>
                    <div className="ngraph-contextmenu-item" onClick={handleInsertRowsBefore}>Insert Before</div>
                    <div className="ngraph-contextmenu-item" onClick={handleInsertRowsAfter}>Insert After</div>
                </div>
            </Overlay>
        );
    } else {
        return null;
    }
}

export default DataGridContextMenu;
