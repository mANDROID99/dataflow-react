import React from 'react';
import MenuDropdownGroup from './MenuDropdownGroup';
import Transition from '../common/Transition';

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
    onItemSelected: (key: string) => void;
    onHide: () => void;
}

export default function MenuDropdown(props: Props): JSX.Element | null {
    const { show, items, onItemSelected } = props;

    return (
        <div className="wrap-graph-menu-dropdown">
            <Transition show={show} render={(show, afterAnimate): React.ReactElement => {
                return (
                    <div style={{ animation: `${show ? 'slideIn' : 'slideOut'} 0.5s`}} onAnimationEnd={afterAnimate}>
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
                    </div>
                );
            }}/>
        </div>
    );
}
