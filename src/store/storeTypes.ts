import { Graph } from "../graph/types/graphTypes";

export type PortDragTarget = {
    nodeId: string;
    portId: string;
}

export type PortDrag = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    portType: string;
    target?: PortDragTarget;
}

export type GraphState = {
    graph: Graph;
    portDrag?: PortDrag;
}

export type GraphsState = {
    graphs: {
        [graphId: string]: GraphState | undefined;
    };
}

export type PortState = {
    x: number;
    y: number;
    connectable: boolean;
}

export type StoreState = {
    graph: GraphsState;
}
