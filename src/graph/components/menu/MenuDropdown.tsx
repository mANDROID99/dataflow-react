import React from 'react';
import MenuDropdownGroup from './MenuDropdownGroup';
import SlideInOut from '../common/SlideInOut';
import Overlay from '../common/Overlay';

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
    const { show, items, onHide, onItemSelected } = props;

    return (
        <div className="wrap-graph-menu-dropdown">
            { show ? <Overlay onHide={onHide}/> : undefined }
            <SlideInOut show={show}>
                <div className="graph-menu-dropdown">
                    {items.map((group, index) => (
                        <MenuDropdownGroup
                            key={index}
                            label={group.label}
                            items={group.items}
                            onItemSelected={onItemSelected}
                        />
                    ))}
                </div>
            </SlideInOut>
        </div>
    );
}
