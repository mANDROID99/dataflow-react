import { useMemo, useRef, useEffect } from "react";
import { Dispatch } from "redux";
import {
    setNodePos,
    setNodeSize,
    setNodeCollapsed,
    setFieldValue,
    showContextMenu,
    selectNode,
    setNodeWidth
} from "../../../store/actions";
import { ContextMenuTargetType, ContextMenuTarget } from "../../../types/storeTypes";
import { GraphNodeConfig } from "../../../types/graphConfigTypes";
import { GraphNode } from "../../../types/graphTypes";

export type NodeActions = {
    setPos(x: number, y: number): void;
    setSize(width: number, height: number): void;
    setWidth(width: number): void;
    setFieldValue(fieldName: string, value: unknown): void;
    setCollapsed(collapsed: boolean): void;
    select(): void;
    showContextMenu(x: number, y: number): void;
    triggerEvent(key: string, payload: null): void;
    triggerNodeChanged(prev: GraphNode, next: GraphNode): void;
}

export function useGraphNodeActions<C, P>(nodeId: string, dispatch: Dispatch, nodeConfig: GraphNodeConfig<C, P>, node: GraphNode, context: C, params: P): NodeActions {
    const paramsRef = useRef({ node, context, params });
    useEffect(() => {
        paramsRef.current = { node, context, params };
    });

    return useMemo((): NodeActions => ({
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
