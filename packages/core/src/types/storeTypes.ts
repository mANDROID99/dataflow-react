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
}

export type NodeBounds = {
    x: number;
    y: number;
    width: number;
    height: number;
    alignBottomEdge?: string;
}

export type GraphEditorState = {
    graph: Graph;
    contextMenu: ContextMenuState | undefined;
    scrollX: number;
    scrollY: number;
    selectedNode: string | undefined;
    portDrag: PortDragState | undefined;
    bounds: {
        [nodeId: string]: NodeBounds;
    };
}

export type StoreState = {
    editor: GraphEditorState;
}
