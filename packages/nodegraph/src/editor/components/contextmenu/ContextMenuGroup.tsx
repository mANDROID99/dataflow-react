import React, { useState } from 'react';
import ContextMenuItem from './ContextMenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type MenuItemGroup = {
    label: string;
    items: { label: string; value: string }[];
}

type Props = {
    group: MenuItemGroup;
    onItemSelected: (key: string) => void;
}

export default function ContextMenuGroup(props: Props) {
    const group = props.group;
    const [expanded, setExpanded] = useState(false);

    const toggle = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <div className={"ngraph-contextmenu-group-header"} onClick={toggle}>
                <FontAwesomeIcon icon={expanded ? "chevron-up" : "chevron-down"}/>
                <span>{group.label}</span>
            </div>
            { expanded ? group.items.map((menuItem, index) => (
                <ContextMenuItem key={index} onItemSelected={props.onItemSelected} {...menuItem}/>
            )) : undefined }
        </>
    );
}

