import React from 'react';
import Transition from './Transition';
import Overlay from './Overlay';
import classNames from 'classnames';

export type DropdownAction = {
    label: string;
    action: () => void;
}

type Props = {
    show: boolean;
    actions: DropdownAction[];
    right?: boolean;
    onHide: () => void;
}

function Dropdown({ show, actions, onHide, right }: Props) {
    return (
        <Transition show={show}>
            {(show, afterAnimation) => {
                return (
                    <>
                        <Overlay onHide={onHide}/>
                        <div
                            className={classNames("ngraph-dropdown-menu", { right })}
                            style={{ animation: (show ? 'slideIn' : 'slideOut') + ' 0.25s' }}
                            onAnimationEnd={afterAnimation}
                        >
                            {actions.map((action, index) => (
                                <div key={index} className="ngraph-dropdown-menu-item" onClick={() => {
                                    onHide();
                                    action.action();
                                }}>
                                    {action.label}
                                </div>
                            ))}
                        </div>
                    </>
                );
            }}
        </Transition>
    );
}

export default React.memo(Dropdown);
