import React, { useState, useEffect } from 'react';
import Overlay from '../common/Overlay';
import Transition from '../common/Transition';
import { Action, ActionType } from './DataGrid';

type Props = {
    mousePos: { x: number; y: number } | undefined;
    dispatch: React.Dispatch<Action>;
    onHide: () => void;
}

export default function DataGridContextMenu(props: Props) {
    const dispatch = props.dispatch;
    const onHide = props.onHide;
    const [mousePos, setMousePos] = useState(props.mousePos);

    useEffect(() => {
        if (props.mousePos) {
            setMousePos(props.mousePos);
        }
    }, [props.mousePos]);

    const handleDeleteRows = () => {
        onHide();
        dispatch({ type: ActionType.DELETE_SELECTED_ROWS });
    };

    const handleInsertAfter = () => {
        onHide();
        dispatch({ type: ActionType.INSERT_ROW_AFTER });
    };

    const handleInsertBefore = () => {
        onHide();
        dispatch({ type: ActionType.INSERT_ROW_BEFORE });
    };

    return (
        <Transition show={props.mousePos != null} render={(show, onAnimationEnd) => (
            <Overlay onHide={props.onHide}>
                <div
                    className="context-menu bg-container"
                    style={{
                        left: mousePos!.x,
                        top: mousePos!.y,
                        animation: `${show ? 'slideIn' : 'slideOut'} 0.5s`
                    }}
                    onAnimationEnd={onAnimationEnd}
                >
                    <div className="context-menu-item" onClick={handleDeleteRows}>Delete Rows</div>
                    <div className="context-menu-item" onClick={handleInsertBefore}>Insert Row Before</div>
                    <div className="context-menu-item" onClick={handleInsertAfter}>Insert Row After</div>
                </div>
            </Overlay>
        )}/>        
    );
}

