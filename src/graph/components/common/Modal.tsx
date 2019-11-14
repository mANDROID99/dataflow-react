import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
import SlideInOut from './SlideInOut';
import { graphContext } from '../Graph';

type Props = {
    show: boolean;
    onHide: () => void;
}

export default function Modal(props: Props): React.ReactElement {
    const { show, onHide } = props;
    const { modalRoot } = useContext(graphContext);

    return createPortal(
        <SlideInOut show={show}>
            <>
                <Overlay onHide={onHide}/>
                <div className="modal">
                    <h1>Hello Modal</h1>
                </div>
            </>
        </SlideInOut>
    , modalRoot);
}
