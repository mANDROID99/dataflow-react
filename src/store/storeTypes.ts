import { Graph } from "../graph/types/graphTypes"

export type GraphState = {
    graphs: {
        [id: string]: Graph
    };
}

export type StoreState = {
    graph: GraphState;
}

