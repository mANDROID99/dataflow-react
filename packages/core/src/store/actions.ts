import { Graph, GraphNode } from "../types/graphTypes";
import { ContextMenuTarget, PortTarget } from "../types/storeTypes";

export enum GraphActionType {
    LOAD_GRAPH = 'LOAD_GRAPH',
    CLEAR_GRAPH = 'CLEAR_GRAPH',
    ADD_NODE = 'CREATE_NODE',
    DELETE_NODE = 'DELETE_NODE',
    CLONE_NODE = 'COPY_NODE',
    SET_NODE_NAME = 'RENAME_NODE',
    SET_FIELD_VALUE = 'SET_FIELD_VALUE',
    SET_NODE_POS = 'SET_NODE_POS',
    SET_NODE_WIDTH = 'SET_NODE_WIDTH',
    SET_NODE_SIZE = 'SET_NODE_SIZE',
    SET_NODE_COLLAPSED = 'SET_NODE_COLLAPSED',
    SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU',
    HIDE_CONTEXT_MENU = 'HIDE_CONTEXT_MENU',
    SELECT_NODE = 'SELECT_NODE',
    CLEAR_SELECTED_NODE = 'CLEAR_SELECTED_NODE',
    BEGIN_PORT_DRAG = 'BEGIN_PORT_DRAG',
    END_PORT_DRAG = 'END_PORT_DRAG',
    SET_PORT_DRAG_TARGET = 'SET_PORT_DRAG_TARGET',
    CLEAR_PORT_DRAG_TARGET = 'CLEAR_PORT_DRAG_TARGET',
    SET_NODE_BOUNDS = 'SET_NODE_BOUNDS',
    SET_NODE_CONTEXT = 'SET_NODE_CONTEXT',
    MOVE_OVERLAPPING_BOUNDS = 'MOVE_OVERLAPPING_BOUNDS'
}

export type LoadGraphAction = {
    type: GraphActionType.LOAD_GRAPH;
    graph: Graph;
}

export function loadGraph(graph: Graph): LoadGraphAction {
    return {
        type: GraphActionType.LOAD_GRAPH,
        graph
    };
}

export type ClearGraphAction = {
    type: GraphActionType.CLEAR_GRAPH;
}

export function clearGraph(): ClearGraphAction {
    return {
        type: GraphActionType.CLEAR_GRAPH
    };
}

export type AddNodeAction = {
    type: GraphActionType.ADD_NODE;
    node: GraphNode | GraphNode[];
}

export function addNode(node: GraphNode | GraphNode[]): AddNodeAction {
    return {
        type: GraphActionType.ADD_NODE,
        node
    };
}

export type DeleteNodeAction = {
    type: GraphActionType.DELETE_NODE;
    nodeId: string;
}

export function deleteNode(nodeId: string): DeleteNodeAction {
    return {
        type: GraphActionType.DELETE_NODE,
        nodeId
    };
}

export type CloneNodeAction = {
    type: GraphActionType.CLONE_NODE;
    nodeId: string;
}

export function cloneNode(nodeId: string): CloneNodeAction {
    return {
        type: GraphActionType.CLONE_NODE,
        nodeId
    };
}

export type SetNodeNameAction = {
    type: GraphActionType.SET_NODE_NAME;
    nodeId: string;
    name: string;
}

export function setNodeName(nodeId: string, name: string): SetNodeNameAction {
    return {
        type: GraphActionType.SET_NODE_NAME,
        nodeId,
        name
    };
}

export type SetFieldValueAction = {
    type: GraphActionType.SET_FIELD_VALUE;
    nodeId: string;
    fieldName: string;
    value: unknown;
}

export function setFieldValue(nodeId: string, fieldName: string, value: unknown): SetFieldValueAction {
    return {
        type: GraphActionType.SET_FIELD_VALUE,
        nodeId,
        fieldName,
        value
    };
}

export type ShowContextMenuAction = {
    type: GraphActionType.SHOW_CONTEXT_MENU;
    target: ContextMenuTarget | undefined;
    x: number;
    y: number;
}

export function showContextMenu(target: ContextMenuTarget | undefined, x: number, y: number): ShowContextMenuAction {
    return {
        type: GraphActionType.SHOW_CONTEXT_MENU,
        target,
        x,
        y
    };
}

export type HideContextMenuAction = {
    type: GraphActionType.HIDE_CONTEXT_MENU;
}

export function hideContextMenu(): HideContextMenuAction {
    return {
        type: GraphActionType.HIDE_CONTEXT_MENU
    };
}

export type SelectNodeAction = {
    type: GraphActionType.SELECT_NODE;
    nodeId: string;
}

export function selectNode(nodeId: string): SelectNodeAction {
    return {
        type: GraphActionType.SELECT_NODE,
        nodeId
    };
}

export type ClearSelectedNodeAction = {
    type: GraphActionType.CLEAR_SELECTED_NODE;
}

export function clearSelectedNode(): ClearSelectedNodeAction {
    return {
        type: GraphActionType.CLEAR_SELECTED_NODE
    };
}

export type SetNodePosAction = {
    type: GraphActionType.SET_NODE_POS;
    nodeId: string;
    x: number;
    y: number;
}

export function setNodePos(nodeId: string, x: number,y: number): SetNodePosAction {
    return {
        type: GraphActionType.SET_NODE_POS,
        nodeId,
        x,
        y
    };
}

export type SetNodeSizeAction = {
    type: GraphActionType.SET_NODE_SIZE;
    nodeId: string;
    width: number;
    height: number;
}

export function setNodeSize(nodeId: string, width: number, height: number): SetNodeSizeAction {
    return {
        type: GraphActionType.SET_NODE_SIZE,
        nodeId,
        width,
        height
    };
}

export type SetNodeWidthAction = {
    type: GraphActionType.SET_NODE_WIDTH;
    nodeId: string;
    width: number;
}


export function setNodeWidth(nodeId: string, width: number): SetNodeWidthAction {
    return {
        type: GraphActionType.SET_NODE_WIDTH,
        nodeId,
        width
    };
}


export type SetNodeCollapsedAction = {
    type: GraphActionType.SET_NODE_COLLAPSED;
    nodeId: string;
    collapsed: boolean;
}

export function setNodeCollapsed(nodeId: string, collapsed: boolean): SetNodeCollapsedAction {
    return {
        type: GraphActionType.SET_NODE_COLLAPSED,
        nodeId,
        collapsed
    };
}

export type BeginPortDragAction = {
    type: GraphActionType.BEGIN_PORT_DRAG;
    port: PortTarget;
}

export function beginPortDrag(port: PortTarget): BeginPortDragAction {
    return {
        type: GraphActionType.BEGIN_PORT_DRAG,
        port
    };
}

export type EndPortDragAction = {
    type: GraphActionType.END_PORT_DRAG;
}

export function endPortDrag(): EndPortDragAction {
    return {
        type: GraphActionType.END_PORT_DRAG
    };
}

export type SetPortDragTargetAction = {
    type: GraphActionType.SET_PORT_DRAG_TARGET;
    port: PortTarget;
}

export function setPortDragTarget(port: PortTarget): SetPortDragTargetAction {
    return {
        type: GraphActionType.SET_PORT_DRAG_TARGET,
        port
    };
}

export type ClearPortDragTargetAction = {
    type: GraphActionType.CLEAR_PORT_DRAG_TARGET;
    port: PortTarget;
}

export function clearPortDragTarget(port: PortTarget) {
    return {
        type: GraphActionType.CLEAR_PORT_DRAG_TARGET,
        port
    };
}

export type SetNodeBoundsAction = {
    type: GraphActionType.SET_NODE_BOUNDS;
    nodeId: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export function setNodeBounds(nodeId: string, x: number, y: number, width: number, height: number): SetNodeBoundsAction {
    return { type: GraphActionType.SET_NODE_BOUNDS, nodeId, x, y, width, height };
}

export type MoveOverlappingBoundsAction = {
    type: GraphActionType.MOVE_OVERLAPPING_BOUNDS;
    nodeId: string;
}

export function moveOverlapping(nodeId: string): MoveOverlappingBoundsAction {
    return { type: GraphActionType.MOVE_OVERLAPPING_BOUNDS, nodeId };
}

export type GraphAction = 
    | LoadGraphAction
    | AddNodeAction
    | DeleteNodeAction
    | CloneNodeAction
    | SetFieldValueAction
    | SelectNodeAction
    | ClearSelectedNodeAction
    | ShowContextMenuAction
    | HideContextMenuAction
    | SetNodePosAction
    | SetNodeWidthAction
    | BeginPortDragAction
    | EndPortDragAction
    | SetPortDragTargetAction
    | ClearPortDragTargetAction
    | SetNodeBoundsAction
    | MoveOverlappingBoundsAction
    ;

