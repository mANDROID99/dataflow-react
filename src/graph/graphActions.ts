import { PortRef } from "../store/storeTypes";

export enum ActionType {
    START_NODE_DRAG = 'node-graph.START_NODE_DRAG',
    UPDATE_NODE_DRAG = 'node-graph.UPDATE_NODE_DRAG',
    END_NODE_DRAG = 'node-graph.END_NODE_DRAG',
    START_PORT_DRAG = 'node-graph.START_PORT_DRAG',
    UPDATE_PORT_DRAG = 'node-graph.UPDATE_PORT_DRAG',
    END_PORT_DRAG = 'node-graph.END_PORT_DRAG',
    MOUNT_PORT = 'node-graph.MOUNT_PORT',
    UNMOUNT_PORT = 'node-graph.UNMOUNT_PORT',
    SET_PORT_DRAG_TARGET = 'node-graph.SET_PORT_DRAG_TARGET',
    UNSET_PORT_DRAG_TARGET = 'node-graph.UNSET_PORT_DRAG_TARGET',
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
    SET_NODE_FIELD_VALUE = 'node-graph.SET_NODE_FIELD_VALUE'
}

export function startNodeDrag(graph: string, node: string): StartNodeDragAction {
    return {
        type: ActionType.START_NODE_DRAG,
        graph,
        node
    };
}

export type StartNodeDragAction = {
    type: ActionType.START_NODE_DRAG;
    graph: string;
    node: string;
}

export function updateNodeDrag(graph: string, dragX: number, dragY: number): UpdateNodeDragAction {
    return {
        type: ActionType.UPDATE_NODE_DRAG,
        graph,
        dragX,
        dragY
    };
}

export type UpdateNodeDragAction = {
    type: ActionType.UPDATE_NODE_DRAG;
    graph: string;
    dragX: number;
    dragY: number;
}

export function endNodeDrag(graph: string): EndNodeDragAction {
    return {
        type: ActionType.END_NODE_DRAG,
        graph
    };
}

export type EndNodeDragAction = {
    type: ActionType.END_NODE_DRAG;
    graph: string;
}


export function startPortDrag(graph: string, port: PortRef, mouseX: number, mouseY: number): StartPortDragAction {
    return {
        type: ActionType.START_PORT_DRAG,
        graph,
        port,
        mouseX,
        mouseY
    };
}

export type StartPortDragAction = {
    type: ActionType.START_PORT_DRAG;
    graph: string;
    port: PortRef;
    mouseX: number;
    mouseY: number;
}

export function updatePortDrag(graph: string, mouseX: number, mouseY: number): UpdatePortDragAction {
    return {
        type: ActionType.UPDATE_PORT_DRAG,
        graph,
        mouseX,
        mouseY
    };
}

export type UpdatePortDragAction = {
    type: ActionType.UPDATE_PORT_DRAG;
    graph: string;
    mouseX: number;
    mouseY: number;
}

export function endPortDrag(graph: string): EndPortDragAction {
    return {
        type: ActionType.END_PORT_DRAG,
        graph
    };
}

export type EndPortDragAction = {
    type: ActionType.END_PORT_DRAG;
    graph: string;
}

export function mountPort(graph: string, port: PortRef, xOff: number, yOff: number): MountPortAction {
    return {
        type: ActionType.MOUNT_PORT,
        graph,
        port,
        xOff,
        yOff
    };
}

export type MountPortAction = {
    type: ActionType.MOUNT_PORT;
    graph: string;
    port: PortRef;
    xOff: number;
    yOff: number;
}

export function unmountPort(graph: string, port: PortRef): UnmountPortAction {
    return {
        type: ActionType.UNMOUNT_PORT,
        graph,
        port
    };
}

export type UnmountPortAction = {
    type: ActionType.UNMOUNT_PORT;
    graph: string;
    port: PortRef;
}


export function setPortDragTarget(graph: string, port: PortRef): SetPortDragTargetAction {
    return {
        type: ActionType.SET_PORT_DRAG_TARGET,
        graph,
        port
    };
}

export type SetPortDragTargetAction = {
    type: ActionType.SET_PORT_DRAG_TARGET;
    graph: string;
    port: PortRef;
}


export function unsetPortDragTarget(graph: string, port: PortRef): UnsetPortDragTargetAction {
    return {
        type: ActionType.UNSET_PORT_DRAG_TARGET,
        graph,
        port
    };
}

export type UnsetPortDragTargetAction = {
    type: ActionType.UNSET_PORT_DRAG_TARGET;
    graph: string;
    port: PortRef;
}

export function removeNode(graph: string, node: string): RemoveNodeAction {
    return {
        type: ActionType.REMOVE_NODE,
        graph,
        node
    };
}

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graph: string;
    node: string;
}

export function setFieldValue(graph: string, node: string, field: string, value: unknown): setFieldValueAction {
    return {
        type: ActionType.SET_NODE_FIELD_VALUE,
        graph,
        node,
        field,
        value
    };
}

export type setFieldValueAction = {
    type: ActionType.SET_NODE_FIELD_VALUE;
    graph: string;
    node: string;
    field: string;
    value: unknown;
}

export type GraphAction =
    | RemoveNodeAction
    | StartPortDragAction
    | UpdatePortDragAction
    | EndPortDragAction
    | StartNodeDragAction
    | UpdateNodeDragAction
    | EndNodeDragAction
    | SetPortDragTargetAction
    | UnsetPortDragTargetAction
    | MountPortAction
    | UnmountPortAction
    | setFieldValueAction
