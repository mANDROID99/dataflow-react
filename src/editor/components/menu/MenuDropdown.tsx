import React from 'react';
import MenuDropdownGroup from './MenuDropdownGroup';
import Transition from '../common/Transition';
import Overlay from '../common/Overlay';

export type MenuItem = {
    label: string;
    value: string;
    group?: string;
}

export type MenuItemGroup = {
    label: string;
    items: MenuItem[];
}

type Props = {
    show: boolean;
    items: MenuItemGroup[];
    onItemSelected: (key: string) => void;
    onHide: () => void;
}

export default function MenuDropdown(props: Props): JSX.Element | null {
    const { show, items, onHide, onItemSelected } = props;

    return (
        <div className="wrap-graph-menu-dropdown">
            <Transition show={show} render={(show, afterAnimate): React.ReactElement => {
                return (
                    <>
                        <Overlay onHide={onHide}/>
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
                    </>
                );
            }}/>
        </div>
    );
}
