import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

import { GraphConfig } from "../../../types/graphConfigTypes";

import { useGraphContext } from "../../graphEditorContext";
import ContextMenuGroup, { MenuItemGroup } from "./ContextMenuGroup";
import { addNode } from "../../../store/actions";
import { createGraphNode } from "../../../utils/graph/graphNodeFactory";
import { v4 } from "uuid";

function resolveMenuItems<Ctx, Params>(graphConfig: GraphConfig<Ctx, Params>): MenuItemGroup[] {
    const groupsByName = new Map<string, MenuItemGroup>();

    const graphNodes = graphConfig.nodes;
    for (const nodeId in graphNodes) {
        const graphNode = graphNodes[nodeId];

        const groupName = graphNode.menuGroup;
        let group: MenuItemGroup | undefined = groupsByName.get(groupName);
        
        if (!group) {
            group = { items: [], label: groupName };
            groupsByName.set(groupName, group);
        }

        group.items.push({
            label: graphNode.title,
            value: nodeId
        });
    }

    return Array.from(groupsByName.values());
}

type Props = {
    x: number;
    y: number;
}

function ContextMenuContentCreate(props: Props) {
    const x = props.x;
    const y = props.y;

    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext();

    const menuItems = useMemo(() => {
        return resolveMenuItems(graphConfig);
    }, [graphConfig]);

    const handleCreateNode = (nodeType: string) => {
        const nodeId = v4();
        const node = createGraphNode(nodeId, x, y, nodeType, graphConfig);
        dispatch(addNode(nodeId, node));
    };

    return (
        <div className="ngraph-contextmenu-content">
            <div className="ngraph-contextmenu-header">Create</div>
            {menuItems.map((group, index) => (
                <ContextMenuGroup key={index} onItemSelected={handleCreateNode} group={group}/>
            ))}
        </div>
    );
}

export default ContextMenuContentCreate;
