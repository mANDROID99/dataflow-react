import { Graph } from "./graphTypes";

export type PortTarget = {
    nodeId: string;
    parentNodeId: string | undefined;
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
    selectedNode: string | undefined;
    portDrag: PortDragState | undefined;
    nodeBounds: {
        [nodeId: string]: NodeBounds;
    };
    nodeContexts: {
        [nodeId: string]: unknown;
    };
}

export type StoreState = {
    editor: GraphEditorState;
}
