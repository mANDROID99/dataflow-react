import { Graph } from "./graphTypes"

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
}

export type NodeDrag = {
    node: string;
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
    INIT
}

export type GraphAction =
    { type: GraphActionType.INIT, graph: Graph };

