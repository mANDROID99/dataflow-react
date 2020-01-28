import React, { useState } from 'react';
import { ContextMenu, ContextMenuItem } from './contextMenuTypes';

type ItemProps = {
    onHide: () => void;
    menuItem: ContextMenuItem;
}

function ContextMenuItemComponent(props: ItemProps) {

    const handleClick = () => {
        props.menuItem.action();
    }

    return (
        <div className="ngraph-context-menu-item" onClick={handleClick}>
            {props.menuItem.label}
        </div>
    );
}

type Props = {
    onHide: () => void;
    menu: ContextMenu;
}

function ContextMenuComponent(props: Props) {
    const [show, setShowing] = useState(true);

    const handleHide = () => {
        setShowing(false);
    }

    const handleExit = () => {
        if (!show) {
            props.onHide();
        }
    }

    return (
        <div
            className={"ngraph-context-menu"}
            style={{
                left: props.menu.x,
                top: props.menu.y,
                animation: show ? 'in' : 'out'
            }}
            onAnimationEnd={handleExit}
        >
            <div className="ngraph-context-menu-title">
                {props.menu.title}
            </div>
            <div className="ngraph-context-menu-list">
                {props.menu.items.map((item, index) => (
                    <ContextMenuItemComponent onHide={handleHide} key={index} menuItem={item}/>
                ))}
            </div>
        </div>
    );
}

export default ContextMenuComponent;
