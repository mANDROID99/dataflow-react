import { Graph } from "../graph/types/graphTypes"

export type DraggedNode = {
    node: string;
}

export type DraggedPort = {
    node: string;
    port: string;
    out: boolean;
}

export type GraphState = {
    graphs: {
        [graphId: string]: Graph;
    };
    dragPort?: DraggedPort;
    dragNode?: DraggedNode;
}

export type PortState = {
    x: number;
    y: number;
    connectable: boolean;
}

export type StoreState = {
    graph: GraphState;
}
