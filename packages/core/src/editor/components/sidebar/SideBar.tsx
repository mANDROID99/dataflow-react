import React, { useMemo } from 'react';
import { useGraphContext } from '../../graphEditorContext';
import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import NodeListItemGroup, { Group } from './NodeListItemGroup';
import GraphTemplateChooser from './GraphTemplateChooser';
import GraphDataEditor from './GraphDataEditor';

function groupGraphNodes(nodes: { [type: string]: GraphNodeConfig<unknown, unknown> }) {
    const lookup = new Map<string, Group>();
    const groups: Group[] = [];

    for (const nodeType in nodes) {
        const node = nodes[nodeType];
        const menuGroup = node.menuGroup;
        if (!menuGroup) continue;

        let group = lookup.get(menuGroup);
        if (!group) {
            group = { name: menuGroup, entries: [] };
            lookup.set(menuGroup, group);
            groups.push(group);
        }

        group.entries.push({
            id: nodeType,
            label: node.title
        });
    }

    return groups;
}

export default function SideBar() {
    const { graphConfig } = useGraphContext();
    const nodeGroups = useMemo(() => groupGraphNodes(graphConfig.nodes), [graphConfig.nodes]);

    return (
        <div className="ngraph-sidebar">
            <div className="ngraph-text-h1 ngraph-my-5 ngraph-text-center">
                Nodes
            </div>
            <div className="ngraph-flex-grow ngraph-overflow-auto">
                {nodeGroups.map((group, index) => (
                    <NodeListItemGroup key={index} group={group}/>
                ))}
            </div>
            <div className="ngraph-sidebar-footer">
                <GraphTemplateChooser/>
                <GraphDataEditor/>
            </div>
        </div>
    );
}


