import { Graph, GraphNode } from "../types/graphTypes";
import { ContextMenuTarget, Receiver, PortTarget } from "../types/storeTypes";

export enum GraphActionType {
    LOAD_GRAPH = 'LOAD_GRAPH',
    ADD_NODE = 'CREATE_NODE',
    DELETE_NODE = 'DELETE_NODE',
    CLONE_NODE = 'COPY_NODE',
    SET_FIELD_VALUE = 'SET_FIELD_VALUE',
    SET_NODE_POS = 'SET_NODE_POS',
    SET_NODE_WIDTH = 'SET_NODE_WIDTH',
    SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU',
    HIDE_CONTEXT_MENU = 'HIDE_CONTEXT_MENU',
    UPDATE_SCROLL = 'UPDATE_SCROLL',
    SELECT_NODE = 'SELECT_NODE',
    CLEAR_SELECTED_NODE = 'CLEAR_SELECTED_NODE',
    BEGIN_PORT_DRAG = 'BEGIN_PORT_DRAG',
    END_PORT_DRAG = 'END_PORT_DRAG',
    SET_PORT_DRAG_TARGET = 'SET_PORT_DRAG_TARGET',
    CLEAR_PORT_DRAG_TARGET = 'CLEAR_PORT_DRAG_TARGET',
    SHOW_FORM = 'SHOW_FORM',
    HIDE_FORM = 'HIDE_FORM',
    CLEAR_FORM = 'CLEAR_FORM',
    SUBMIT_FORM = 'SUBMIT_FORM'
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

export type AddNodeAction = {
    type: GraphActionType.ADD_NODE;
    nodeId: string;
    node: GraphNode;
}

export function addNode(nodeId: string, node: GraphNode): AddNodeAction {
    return {
        type: GraphActionType.ADD_NODE,
        nodeId,
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

export type SetFieldValueAction = {
    type: GraphActionType.SET_FIELD_VALUE;
    nodeId: string;
    fieldName: string;
    value: unknown;
}

export function setNodeFieldValue(nodeId: string, fieldName: string, value: unknown): SetFieldValueAction {
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

export type UpdateScrollAction = {
    type: GraphActionType.UPDATE_SCROLL;
    scrollX: number;
    scrollY: number;
}

export function updateScroll(scrollX: number, scrollY: number): UpdateScrollAction {
    return {
        type: GraphActionType.UPDATE_SCROLL,
        scrollX,
        scrollY
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

export type ShowFormAction = {
    type: GraphActionType.SHOW_FORM;
    formId: string;
    value: unknown;
    params: unknown;
    receiver: Receiver;
}

export function showForm(formId: string, value: unknown, params: unknown, receiver: Receiver): ShowFormAction {
    return {
        type: GraphActionType.SHOW_FORM,
        formId,
        value,
        params,
        receiver
    };
}

export type HideFormAction = {
    type: GraphActionType.HIDE_FORM;
    formId: string;
}

export function hideForm(formId: string): HideFormAction {
    return {
        type: GraphActionType.HIDE_FORM,
        formId
    };
}

export type ClearFormAction = {
    type: GraphActionType.CLEAR_FORM;
    formId: string;
}

export function clearForm(formId: string): ClearFormAction {
    return {
        type: GraphActionType.CLEAR_FORM,
        formId
    };
}

export type SubmitFormAction = {
    type: GraphActionType.SUBMIT_FORM;
    formId: string;
    value: unknown;
}

export function submitForm(formId: string, value: unknown): SubmitFormAction {
    return {
        type: GraphActionType.SUBMIT_FORM,
        formId,
        value
    };
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
    | UpdateScrollAction
    | SetNodePosAction
    | SetNodeWidthAction
    | BeginPortDragAction
    | EndPortDragAction
    | SetPortDragTargetAction
    | ClearPortDragTargetAction
    | ShowFormAction
    | HideFormAction
    | ClearFormAction
    | SubmitFormAction
    ;

