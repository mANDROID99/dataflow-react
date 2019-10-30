import { Graph } from "../graph/types/graphTypes"

export type GraphState = {
    graphs: {
        [graphId: string]: Graph
    };
}

export type PortState = {
    x: number;
    y: number;
    connectable: boolean;
}

export type StoreState = {
    graph: GraphState;
}
