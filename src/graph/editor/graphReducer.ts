import { Graph } from "../types/graphTypes";
import { GraphState, GraphAction, GraphActionType } from "../types/graphStateTypes";

export function init(graph: Graph): GraphState {
    return {
        graph,
        initialGraph: graph,
        nodeDrag: undefined,
        portDrag: undefined
    };
}

export function reducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case GraphActionType.INIT:
            return init(action.graph);
        default:
            return state;
    }
}
