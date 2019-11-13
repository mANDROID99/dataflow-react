import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import MenuDropdownGroup from './MenuDropdownGroup';

export type MenuItem = {
    label: string;
    value: string;
    order: number;
    group?: string;
}

export type MenuItemGroup = {
    label: string;
    items: MenuItem[];
    order: number;
}

type Props = {
    show: boolean;
    items: MenuItemGroup[];
    onHide: () => void;
    onItemSelected: (key: string) => void;
}

export default function MenuDropdown(props: Props): JSX.Element | null {
    const [hidden, setHidden] = useState(true);
    const show = props.show;
    const items = props.items;

    const afterAnimation = useCallback(() => {
        if (!show) {
            setHidden(true);
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            setHidden(false);
        }
    }, [show]);

    return (
        <div className="wrap-graph-menu-dropdown">
            { show ? <div className="overlay" onClick={props.onHide}/> : undefined }
            <div className={classNames("graph-menu-dropdown fade-down", { hidden, in: show })} onTransitionEnd={afterAnimation}>
                {items.map((group, index) => (
                    <MenuDropdownGroup
                        key={index}
                        label={group.label}
                        items={group.items}
                        onItemSelected={props.onItemSelected}
                    />
                ))}
            </div>
        </div>
    );
}
