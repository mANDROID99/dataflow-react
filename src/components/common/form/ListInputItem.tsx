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
        <div className="ngraph-form-list-item">
            <div className="ngraph-form-icon-btn" onClick={handleRemove}>
                <FontAwesomeIcon icon={faTimes}/>
            </div>
            {children}
            <div className="ngraph-form-list-item--move">
                {hasPrev && <div className="ngraph-form-icon-btn" onClick={handleMoveUp}>
                    <FontAwesomeIcon icon={faChevronUp}/>
                </div>}
                {hasNext && <div className="ngraph-form-icon-btn" onClick={handleMoveDown}>
                    <FontAwesomeIcon icon={faChevronDown}/>
                </div>}
            </div>
        </div>
    );
}

