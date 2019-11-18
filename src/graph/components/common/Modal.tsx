import React, { useContext } from 'react';
import { createPortal } from 'react-dom';

import { graphContext } from '../Graph';
import Transition from './Transition';
import ModalOverlay from './ModalOverlay';

type Props = {
    show: boolean;
    children: React.ReactChild;
    onHide: () => void;
}

export default function Modal(props: Props): React.ReactElement {
    const { children, show, onHide } = props;
    const { modalRoot } = useContext(graphContext);
    
    return createPortal(
        <Transition show={show} render={(show, afterAnimation): React.ReactElement => {
            return (
                <div className="ngr-modal" style={{ animation: `${show ? 'fadeIn' : 'fadeOut'} 0.2s` }} onAnimationEnd={afterAnimation}>
                    <ModalOverlay onHide={onHide}/>
                    {children}
                </div>
            );
        }}/>, modalRoot);
}
