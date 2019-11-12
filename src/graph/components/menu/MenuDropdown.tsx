import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';

type Props = {
    show: boolean;
}

export default function MenuDropdown(props: Props): JSX.Element | null {
    const [isHidden, setHidden] = useState(!props.show);
    const show = props.show;

    useEffect(() => {
        if (show) {
            setHidden(false);
        }
    }, [show]);

    const afterAnimation = useCallback(() => {
        if (!show) {
            setHidden(true);
        }
    }, [show]);

    return (
        <div className={classNames("graph-menu-dropdown p-2", { in: props.show, hidden: isHidden })} onTransitionEnd={afterAnimation}>
            <div className="graph-menu-dropdown-group">
                <div className="graph-menu-dropdown-item">Grid</div>
            </div>
            <div className="graph-menu-dropdown-group">
                <div className="graph-menu-dropdown-item">Group-By</div>
                <div className="graph-menu-dropdown-item">Sum</div>
                <div className="graph-menu-dropdown-item">Count</div>
            </div>
            <div className="graph-menu-dropdown-group">
                <div className="graph-menu-dropdown-item">Output</div>
            </div>
        </div>
    );
}
