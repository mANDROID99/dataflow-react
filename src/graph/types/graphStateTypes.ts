import { Graph } from "./graphTypes"

// state

export type DragState = {
    x: number;
    y: number;
}

export type NodePortState = {
    drag?: DragState;
    dragging: boolean;
}

export type PortsState = {
    in: {
        [id: string]: NodePortState | undefined;
    },
    out: {
        [id: string]: NodePortState | undefined;
    }
}

export type NodeState = {
    drag?: DragState;
    dragging: boolean;
    portsIn: {
        [name: string]: NodePortState | undefined;
    },
    portsOut: {
        [name: string]: NodePortState | undefined;
    }
}

export type GraphState = {
    graph: Graph;
    nodes: {
        [id: string]: NodeState;
    }
}

// actions

export enum GraphActionType {
    INIT,
    BEGIN_NODE_DRAG,
    UPDATE_NODE_DRAG,
    CLEAR_NODE_DRAG,
    BEGIN_PORT_DRAG,
    UPDATE_PORT_DRAG,
    CLEAR_PORT_DRAG
}

export type GraphAction = 
    | { type: GraphActionType.INIT, graph: Graph }
    | { type: GraphActionType.BEGIN_NODE_DRAG, nodeId: string }
    | { type: GraphActionType.UPDATE_NODE_DRAG, nodeId: string, x: number, y: number }
    | { type: GraphActionType.CLEAR_NODE_DRAG, nodeId: string }
    | { type: GraphActionType.BEGIN_PORT_DRAG, nodeId: string, portIn: boolean, portName: string }
    | { type: GraphActionType.UPDATE_PORT_DRAG, nodeId: string, portIn: boolean, portName: string, x: number, y: number }
    | { type: GraphActionType.CLEAR_PORT_DRAG, nodeId: string, portIn: boolean, portName: string };

