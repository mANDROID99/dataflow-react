import { Graph } from "./graphTypes";

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
