import { Graph } from "./graphTypes";

export type PortTarget = {
    nodeId: string;
    nodeType: string;
    portName: string;
    portOut: boolean;
    connectMulti: boolean;
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
    port: PortTarget;
    target: PortTarget | undefined;
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

export enum ReceiverType {
    NODE_FIELD
}

export type Receiver =
    | { type: ReceiverType.NODE_FIELD; nodeId: string; fieldId: string };

export type FormState = {
    show: boolean;
    value: unknown;
    params: unknown;
    receiver: Receiver;
}

export type FormStates = {
    [formId: string]: FormState | undefined;
}

export type GraphEditorState = {
    graph: Graph;
    contextMenu: ContextMenuState | undefined;
    scrollX: number;
    scrollY: number;
    selectedNode: string | undefined;
    portDrag: PortDragState | undefined;
    ports: PortStates;
    forms: FormStates;
}

export type StoreState = {
    graphEditor: GraphEditorState;
}

export function nodeFieldReceiver(nodeId: string, fieldId: string): Receiver {
    return {
        type: ReceiverType.NODE_FIELD,
        nodeId,
        fieldId
    };
}
