import React, { useState, useEffect } from 'react';
import Overlay from '../common/Overlay';
import Transition from '../common/Transition';

type Props = {
    mousePos: { x: number; y: number } | undefined;
    onHide: () => void;
}

export default function DataGridContextMenu(props: Props) {
    const [mousePos, setMousePos] = useState(props.mousePos);

    useEffect(() => {
        if (props.mousePos) {
            setMousePos(props.mousePos);
        }
    }, [props.mousePos]);

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
                    <div className="context-menu-item">Delete Rows</div>
                    <div className="context-menu-item">Insert Row Before</div>
                    <div className="context-menu-item">Insert Row After</div>
                </div>
            </Overlay>
        )}/>        
    );
}

