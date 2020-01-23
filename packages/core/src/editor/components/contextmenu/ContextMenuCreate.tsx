import React, { useCallback, useMemo } from "react";
import { GraphConfig } from "../../../types/graphConfigTypes";
import { GraphActionType } from "../../../types/graphReducerTypes";
import { useGraphContext } from "../../graphEditorContext";
import ContextMenuGroup, { MenuItemGroup } from "./ContextMenuGroup";

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
    const { dispatch, graphConfig } = useGraphContext();

    const menuItems = useMemo(() => {
        return resolveMenuItems(graphConfig);
    }, [graphConfig]);

    const handleCreateNode = useCallback((nodeType: string) => {
        dispatch({
            type: GraphActionType.CREATE_NODE,
            nodeType,
            x, y
        });
    }, [dispatch, x, y]);

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
