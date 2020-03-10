import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Collapse from '../../../common/Collapse';
import NodeListItem from './NodeListItem';

export type GroupEntry = {
    label: string;
    id: string;
}

export type Group = {
    name: string;
    entries: GroupEntry[];
}

type Props = {
    group: Group;
}

export default function NodeListItemGroup({ group }: Props) {
    const [collapsed, setCollapsed] = useState(false);

    const handleToggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="ngraph-mb-2">
            <div className="ngraph-nodelist-group-header" onClick={handleToggleCollapsed}>
                <div className="ngraph-nodelist-header-expander">
                    <FontAwesomeIcon icon={collapsed ? "chevron-up" : "chevron-down"}/>
                </div>
                <div className="ngraph-nodelist-header-text">
                    {group.name}
                </div>
            </div>
            <Collapse collapsed={collapsed}>
                {group.entries.map((entry, index) => (
                    <NodeListItem
                        key={index}
                        label={entry.label}
                        id={entry.id}
                    />
                ))}
            </Collapse>
        </div>
    );
}

