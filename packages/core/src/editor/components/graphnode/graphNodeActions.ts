import { useEffect, useMemo, useRef } from "react";
import { Dispatch } from "redux";
import { selectNode, setFieldValue, setNodeCollapsed, setNodePos, setNodeSize, setNodeWidth, showContextMenu } from "../../../store/actions";
import { GraphNodeConfig } from "../../../types/graphConfigTypes";
import { GraphNodeActions } from "../../../types/graphNodeComponentTypes";
import { GraphNode } from "../../../types/graphTypes";
import { ContextMenuTarget, ContextMenuTargetType } from "../../../types/storeTypes";

export function useGraphNodeActions<C, P>(nodeId: string, dispatch: Dispatch, nodeConfig: GraphNodeConfig<C, P>, node: GraphNode, context: C | undefined, params: P): GraphNodeActions {
    const paramsRef = useRef({ node, context, params });
    useEffect(() => {
        paramsRef.current = { node, context, params };
    });

    return useMemo((): GraphNodeActions => ({
        setPos(x, y) {
            dispatch(setNodePos(nodeId, x, y));
        },

        setSize(width, height) {
            dispatch(setNodeSize(nodeId, width, height));
        },

        setWidth(width) {
            dispatch(setNodeWidth(nodeId, width));
        },

        setCollapsed(collapsed) {
            dispatch(setNodeCollapsed(nodeId, collapsed));
        },

        setFieldValue(fieldName, value) {
            dispatch(setFieldValue(nodeId, fieldName, value));
        },

        select() {
            dispatch(selectNode(nodeId));
        },

        showContextMenu(x, y) {
            const target: ContextMenuTarget = {
                type: ContextMenuTargetType.GRAPH_NODE,
                nodeId
            };
            dispatch(showContextMenu(target, x, y));
        },

        triggerEvent(key, payload) {
            if (nodeConfig.onEvent) {
                nodeConfig.onEvent(key, payload, { ...paramsRef.current, actions: this });
            }
        },

        triggerNodeChanged(prev, next) {
            if (nodeConfig.onChanged) {
                nodeConfig.onChanged(prev, next, { ...paramsRef.current, actions: this });
            }
        }
    }), [nodeId, nodeConfig, dispatch]);
}
