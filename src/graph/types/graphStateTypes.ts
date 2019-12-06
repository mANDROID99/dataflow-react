import { Graph } from "./graphTypes"

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
}

export type NodeDrag = {
    nodeId: string;
    dragX: number;
    dragY: number;   
}

export type PortDrag = {
    port: PortRef;
    target?: PortRef;
    mouseX: number;
    mouseY: number;
}

export type GraphState = {
    initialGraph: Graph;
    graph: Graph;
    nodeDrag: NodeDrag | undefined;
    portDrag: PortDrag | undefined;
}

export enum GraphActionType {
    INIT,
    NODE_DRAG_BEGIN,
    NODE_DRAG_UPDATE,
    NODE_DRAG_FINISH
}

export type NodeDragBeginAction = { type: GraphActionType.NODE_DRAG_BEGIN, nodeId: string };
export type NodeDragUpdateAction = { type: GraphActionType.NODE_DRAG_UPDATE, dx: number, dy: number };
export type NodeDragEndAction = { type: GraphActionType.NODE_DRAG_FINISH };

export type GraphAction =
    | { type: GraphActionType.INIT, graph: Graph }
    | NodeDragBeginAction
    | NodeDragUpdateAction
    | NodeDragEndAction;
