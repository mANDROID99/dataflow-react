import { StoreState, PortDrag } from "../store/storeTypes";
import { Graph } from "../graph/types/graphTypes";

export function selectPortDrag(graphId: string) {
    return (state: StoreState): PortDrag | undefined => {
        return state.graph.graphs[graphId]?.portDrag;
    };
}

export function selectGraph(graphId: string) {
    return (state: StoreState): Graph | undefined => {
        return state.graph.graphs[graphId]?.graph;
    };
}
