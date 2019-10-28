import { Graph } from "../graph/graphTypes"

export type GraphState = {
    graphs: {
        [id: string]: Graph
    };
}

export type StoreState = {
    graph: GraphState;
}

