import { Graph } from "./graphTypes";
import { PortAlign } from "./graphDefTypes";

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
}

export type PortDragState = PortRef & {
    target?: PortRef;
}

export type NodeState = {
    x: number;
    y: number;
}

export type PortState = {
    align: PortAlign;
    x: number;
    y: number;
}

export type EditorState = {
    graph: Graph;
    nodes: {
        [nodeId: string]: NodeState;
    };
    ports: {
        [portKey: string]: PortState;
    };
    configuring?: string;
    portDrag?: PortDragState;
    theme: string;
}

export type StoreState = {
    editor: EditorState;
}
