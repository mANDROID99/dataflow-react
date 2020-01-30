import React, { useLayoutEffect, useRef } from 'react';
import { createPopper, Placement } from '@popperjs/core';

import { MenuConfig, MenuOptionConfig } from './dropdownTypes';
import { useClickOutside } from '../../hooks/useClickOutside';

type Props = {
    show: boolean;
    menu: MenuConfig;
    placement?: Placement;
    target: React.RefObject<HTMLElement>;
    onHide: () => void;
    onExit: () => void;
}

function DropdownMenu(props: Props) {
    const menu = props.menu;
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const popper = createPopper(props.target.current!, ref.current!, {
            placement: props.placement ?? 'bottom'
        });

        return () => {
            popper.destroy();
        }
    }, []);

    useClickOutside(ref, props.onHide);

    const handleSelectOption = (option: MenuOptionConfig) => {
        option.action();
        props.onHide();
    };

    return (
        <div
            ref={ref}
            className="ngraph-dropdown-menu"
            onAnimationEnd={props.onExit}
            style={{
                animation: (props.show ? 'fadeIn' : 'fadeOut') + ' 0.25s'
            }}
        >
            <div className="ngraph-dropdown-arrow" data-popper-arrow></div>
            <div className="ngraph-dropdown-menu-title">
                {menu.title}
            </div>
            {menu.options.map((option, index) => (
                <div key={index} className="ngraph-dropdown-menu-option" onClick={handleSelectOption.bind(null, option)}>
                    {option.label}
                </div>
            ))}
        </div>
    );
}

export default DropdownMenu;
