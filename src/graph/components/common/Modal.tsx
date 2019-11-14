import React, { useContext } from 'react';
import { createPortal } from 'react-dom';

import { graphContext } from '../Graph';
import Transition from './Transition';
import ModalOverlay from './ModalOverlay';

type Props = {
    show: boolean;
    onHide: () => void;
}

export default function Modal(props: Props): React.ReactElement {
    const { show, onHide } = props;
    const { modalRoot } = useContext(graphContext);
    
    return createPortal(
        <Transition show={show} render={(show, afterAnimation): React.ReactElement => {
            return (
                <div
                    className="modal"
                    style={{ animation: `${show ? 'fadeIn' : 'fadeOut'} 0.2s` }}
                    onAnimationEnd={afterAnimation}
                >
                    <ModalOverlay onHide={onHide}/>
                    <div className="modal-content">
                        <h1>Hello Modal</h1>
                    </div>
                </div>
            );
        }}/>, modalRoot);
}
