import { Graph } from "../graph/types/graphTypes";

export type PortRef = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    portType: string;
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

export type GraphState = {
    graph: Graph;
    ports: {
        [portKey: string]: PortState | undefined;
    };
    nodeDrag?: NodeDrag;
    portDrag?: PortDrag;

}

export type GraphsState = {
    graphs: {
        [graphId: string]: GraphState | undefined;
    };
}

export type StoreState = {
    graph: GraphsState;
}
