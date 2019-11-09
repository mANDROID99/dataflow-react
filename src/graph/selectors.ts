import { StoreState, PortDrag, NodeDrag, GraphState } from "../store/storeTypes";
import { GraphNode } from "./types/graphTypes";

export function selectPortDrag(graphId: string) {
    return (state: StoreState): PortDrag | undefined => {
        return state.graph.graphs[graphId]?.portDrag;
    };
}

export function selectGraphState(graphId: string) {
    return (state: StoreState): GraphState | undefined => {
        return state.graph.graphs[graphId];
    }; 
}

export function selectGraphNodes(graphId: string) {
    return (state: StoreState): { [id: string]: GraphNode } | undefined => {
        return state.graph.graphs[graphId]?.graph.nodes;
    };
}

export function selectNodeDrag(graphId: string) {
    return (state: StoreState): NodeDrag | undefined => {
        return state.graph.graphs[graphId]?.nodeDrag;
    };
}

