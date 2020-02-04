import React, { useMemo } from 'react';
import { useGraphContext } from '../../graphEditorContext';
import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import SideBarGroup, { Group } from './SideBarGroup';

type Props = {

}

function groupGraphNodes(nodes: { [type: string]: GraphNodeConfig<unknown, unknown> }) {
    const lookup = new Map<string, Group>();
    const groups: Group[] = [];

    for (const nodeType in nodes) {
        const node = nodes[nodeType];
        const menuGroup = node.menuGroup;

        let group = lookup.get(menuGroup);
        if (!group) {
            group = { name: menuGroup, nodes: [] }
            lookup.set(menuGroup, group);
            groups.push(group);
        }

        group.nodes.push(node);
    }

    return groups;
}

export default function SideBar(props: Props) {
    const { graphConfig } = useGraphContext();
    const nodeGroups = useMemo(() => groupGraphNodes(graphConfig.nodes), [graphConfig.nodes]);

    return (
        <div className="ngraph-sidebar">
            <div className="ngraph-nodelist">
                {nodeGroups.map((group, index) => (
                    <SideBarGroup key={index} group={group}/>
                ))}
            </div>
        </div>
    );
}


