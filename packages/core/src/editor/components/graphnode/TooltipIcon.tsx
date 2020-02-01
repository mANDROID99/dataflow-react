import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from '../../../common/Tooltip';

type Props = {
    description: string;
}

function TooltipIcon(props: Props) {
    const [tooltipShowing, setTooltipShowing] = useState(false);
    const iconRef = useRef<HTMLDivElement>(null);

    const handleShowTooltip = () => {
        setTooltipShowing(true);
    };

    const handleHideTooltip = () => {
        setTooltipShowing(false);
    };

    return (
        <div
            className="ngraph-header-icon"
            onMouseOver={handleShowTooltip}
            onMouseOut={handleHideTooltip}
        >
            <div ref={iconRef}>
                <FontAwesomeIcon icon="info-circle"/>
            </div>
            <Tooltip
                show={tooltipShowing}
                onHide={handleHideTooltip}
                target={iconRef}
                options={{
                    placement: 'bottom'
                }}
            >
                <div className="ngraph-tt-label">
                    {props.description}
                </div>
            </Tooltip>
        </div>
    );
}

export default TooltipIcon;
