import React from 'react';
import Overlay from './Overlay';

type Props = {
    title: string;
    show: boolean;
    onExit?: () => void;
    onHide?: () => void;
    children: React.ReactNode;
}

export default function Modal({ title, show, onHide, onExit, children }: Props) {
    return (
        <Overlay
            className="ngraph-modal-overlay"
            show={show}
            onHide={onHide}
            onExit={onExit}
        >
            <div
                className="ngraph-modal"
            >
                <div className="ngraph-modal-header">
                    {title}
                </div>
                {children}
            </div>
        </Overlay>
    );
}

