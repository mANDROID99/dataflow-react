import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
library.add(faTimes, faChevronUp, faChevronDown);

type Props = {
    idx: number;
    hasPrev: boolean;
    hasNext: boolean;
    onRemove: (idx: number) => void;
    onMove: (idx: number, offset: number) => void;
    children: React.ReactNode;
}

export default function ListInputItem({ idx, hasPrev, hasNext, onRemove, onMove, children }: Props) {

    const handleRemove = () => onRemove(idx);

    const handleMoveUp = () => onMove(idx, -1);

    const handleMoveDown = () => onMove(idx, 1);

    return (
        <div className="ngr-flex ngr-align-center ngr-mb-2">
            <div className="ngr-icon-btn" onClick={handleRemove}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
            {children}
            <div className="ngr-flex-center-v">
                {hasPrev && <div className="ngr-icon-btn" onClick={handleMoveUp}>
                    <FontAwesomeIcon icon={faChevronUp}/>
                </div>}
                {hasNext && <div className="ngr-icon-btn" onClick={handleMoveDown}>
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>}
            </div>
        </div>
    );
}

