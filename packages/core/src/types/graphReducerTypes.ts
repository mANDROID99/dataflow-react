import { Graph } from "../types/graphTypes";

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    nodeType: string;
}

export enum ContextMenuTargetType {
    GRAPH_NODE
}

export type ContextMenuTarget =
    | { type: ContextMenuTargetType.GRAPH_NODE; nodeId: string }
    ;

export type ContextMenuState = {
    target: ContextMenuTarget | undefined;
    x: number;
    y: number;
}

export type PortDragState = {
    port: PortRef;
    target: PortRef | undefined;
    dragX: number;
    dragY: number;
}

export type PortState = {
    portX: number;
    portY: number;
}

export type PortStates = {
    [portKey: string]: PortState | undefined;
}

export type FormState = {
    show: boolean;
    value: unknown;
    params: unknown;
    onResult: (value: unknown) => void;
}

export type FormStates = {
    [formId: string]: FormState | undefined;
}

export type GraphState = {
    graph: Graph;
    contextMenu: ContextMenuState | undefined;
    scrollX: number;
    scrollY: number;
    selectedNode: string | undefined;
    portDrag: PortDragState | undefined;
    ports: PortStates;
    forms: FormStates;
}

export enum GraphActionType {
    LOAD_GRAPH = 'LOAD_GRAPH',
    CREATE_NODE = 'CREATE_NODE',
    DELETE_NODE = 'DELETE_NODE',
    COPY_NODE = 'COPY_NODE',
    SET_FIELD_VALUE = 'SET_FIELD_VALUE',
    SET_NODE_POS = 'SET_NODE_POS',
    SET_NODE_WIDTH = 'SET_NODE_WIDTH',
    SHOW_CONTEXT_MENU = 'SHOW_CONTEXT_MENU',
    HIDE_CONTEXT_MENU = 'HIDE_CONTEXT_MENU',
    UPDATE_SCROLL = 'UPDATE_SCROLL',
    SELECT_NODE = 'SELECT_NODE',
    CLEAR_SELECTED_NODE = 'CLEAR_SELECTED_NODE',
    BEGIN_PORT_DRAG = 'BEGIN_PORT_DRAG',
    UPDATE_PORT_DRAG = 'UPDATE_PORT_DRAG',
    END_PORT_DRAG = 'END_PORT_DRAG',
    SET_PORT_DRAG_TARGET = 'SET_PORT_DRAG_TARGET',
    CLEAR_PORT_DRAG_TARGET = 'CLEAR_PORT_DRAG_TARGET',
    SET_PORT_POS = 'UPDATE_PORT_POS',
    CLEAR_PORT_POS = 'CLEAR_PORT_POS',
    SHOW_FORM = 'SHOW_FORM_FIELD_EDITOR',
    HIDE_FORM = 'HIDE_FORM_FIELD_EDITOR',
    CLEAR_FORM = 'CLEAR_FORM_FIELD_EDITOR',
    SUBMIT_FORM = 'SUBMIT_FORM_FIELD_EDITOR'
}

export type LoadGraphAction = {
    type: GraphActionType.LOAD_GRAPH;
    graph: Graph;
}

export type CreateNodeAction = {
    type: GraphActionType.CREATE_NODE;
    nodeType: string;
    x: number;
    y: number;
}

export type DeleteNodeAction = {
    type: GraphActionType.DELETE_NODE;
    nodeId: string;
}

export type CopyNodeAction = {
    type: GraphActionType.COPY_NODE;
    nodeId: string;
}

export type SetFieldValueAction = {
    type: GraphActionType.SET_FIELD_VALUE;
    nodeId: string;
    fieldName: string;
    value: unknown;
}

export type ShowContextMenuAction = {
    type: GraphActionType.SHOW_CONTEXT_MENU;
    target: ContextMenuTarget | undefined;
    x: number;
    y: number;
}

export type HideContextMenuAction = {
    type: GraphActionType.HIDE_CONTEXT_MENU;
}

export type UpdateScrollAction = {
    type: GraphActionType.UPDATE_SCROLL;
    scrollX: number;
    scrollY: number;
}

export type SelectNodeAction = {
    type: GraphActionType.SELECT_NODE;
    nodeId: string;
}

export type ClearSelectedNodeAction = {
    type: GraphActionType.CLEAR_SELECTED_NODE;
}

export type SetNodePosAction = {
    type: GraphActionType.SET_NODE_POS;
    nodeId: string;
    x: number;
    y: number;
}

export type SetNodeWidthAction = {
    type: GraphActionType.SET_NODE_WIDTH;
    nodeId: string;
    width: number;
}

export type BeginPortDragAction = {
    type: GraphActionType.BEGIN_PORT_DRAG;
    port: PortRef;
    dragX: number;
    dragY: number;
}

export type UpdatePortDragAction = {
    type: GraphActionType.UPDATE_PORT_DRAG;
    dragX: number;
    dragY: number;
}

export type EndPortDragAction = {
    type: GraphActionType.END_PORT_DRAG;
}

export type SetPortDragTargetAction = {
    type: GraphActionType.SET_PORT_DRAG_TARGET;
    port: PortRef;
}

export type ClearPortDragTargetAction = {
    type: GraphActionType.CLEAR_PORT_DRAG_TARGET;
    port: PortRef;
}

export type SetPortPosAction = {
    type: GraphActionType.SET_PORT_POS;
    port: PortRef;
    x: number;
    y: number;
}

export type ClearPortPosAction = {
    type: GraphActionType.CLEAR_PORT_POS;
    port: PortRef;
}

export type ShowFormAction = {
    type: GraphActionType.SHOW_FORM;
    formId: string;
    value: unknown;
    params: unknown;
    onResult: (value: unknown) => void;
}

export type HideFormAction = {
    type: GraphActionType.HIDE_FORM;
    formId: string;
}

export type ClearFormAction = {
    type: GraphActionType.CLEAR_FORM;
    formId: string;
}

export type SubmitFormAction = {
    type: GraphActionType.SUBMIT_FORM;
    formId: string;
    value: unknown;
}

export type GraphAction = 
    | LoadGraphAction
    | CreateNodeAction
    | DeleteNodeAction
    | CopyNodeAction
    | SetFieldValueAction
    | SelectNodeAction
    | ClearSelectedNodeAction
    | ShowContextMenuAction
    | HideContextMenuAction
    | UpdateScrollAction
    | SetNodePosAction
    | SetNodeWidthAction
    | BeginPortDragAction
    | UpdatePortDragAction
    | EndPortDragAction
    | SetPortDragTargetAction
    | ClearPortDragTargetAction
    | ClearPortPosAction
    | SetPortPosAction
    | ShowFormAction
    | HideFormAction
    | ClearFormAction
    | SubmitFormAction
    ;
