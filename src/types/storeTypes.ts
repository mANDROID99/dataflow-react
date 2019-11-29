import { Graph } from "./graphTypes";

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
}

export type PortDrag = {
    port: PortRef;
    target?: PortRef;
    mouseX: number;
    mouseY: number;
}

export type NodeDrag = {
    node: string;
    dragX: number;
    dragY: number;   
}

export type PortState = {
    offsetX: number;
    offsetY: number;
}

export type GraphEditorState = {
    graph: Graph;
    ports: {
        [portKey: string]: PortState | undefined;
    };
    nodeDrag?: NodeDrag;
    portDrag?: PortDrag;
}

export type GraphEditorStates = {
    [graphId: string]: GraphEditorState | undefined;
}

export type AppState = {
    splitSize: number;
}

export type StoreState = {
    editor: {
        [graphId: string]: GraphEditorState | undefined;
    };
    app: AppState;
}
