import React from 'react';
import cn from 'classnames';

import { MenuConfig, MenuOptionConfig } from './dropdownTypes';

type Props = {
    menu: MenuConfig;
    onHide: () => void;
}

function DropdownMenu(props: Props) {
    const menu = props.menu;

    const handleSelectOption = (option: MenuOptionConfig) => {
        option.action();
        props.onHide();
    };

    return (
        <div className="ngraph-dropdown-menu">
            <div className="ngraph-dropdown-menu-title">
                {menu.title}
            </div>
            {menu.options.map((option, index) => (
                <div
                    key={index}
                    className={cn("ngraph-dropdown-menu-option", { disabled: !!option.disabled })}
                    onClick={option.disabled ? undefined : handleSelectOption.bind(null, option)}
                >
                    {option.label}
                </div>
            ))}
        </div>
    );
}

export default DropdownMenu;
