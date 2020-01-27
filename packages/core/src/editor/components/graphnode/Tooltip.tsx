import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cn from 'classnames';

import { useToggle } from '../../../utils/hooks/useToggle';
import Transition from '../../../common/Transition';


type Props = {
    description: string;
}

function Tooltip(props: Props) {
    const [tooltipShowing, setTooltipShowing] = useState(false);

    const handleShowTooltip = () => {
        setTooltipShowing(true);
    };

    const handleHideTooltip = () => {
        setTooltipShowing(false);
    };

    return (
        <div
            className="ngraph-header-icon ngraph-tooltip"
            onMouseOver={handleShowTooltip}
            onMouseOut={handleHideTooltip}
        >
            <FontAwesomeIcon icon="info-circle"/>
            <Transition show={tooltipShowing} render={(show, onExit) => (
                <div className="ngraph-tooltip-dropdown" style={{ animation: (show ? 'fadeIn' : 'fadeOut') + ' 0.25s' }} onAnimationEnd={onExit}>
                    {props.description}
                </div>
            )}/>
        </div>
    );
}

export default Tooltip;
