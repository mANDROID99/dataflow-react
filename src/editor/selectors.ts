import { StoreState, PortDrag, NodeDrag, GraphEditorState } from "../store/storeTypes";
import { GraphNode } from "./types/graphTypes";

export function selectPortDrag(state: StoreState, graphId: string): PortDrag | undefined {
    return state.editor[graphId]?.portDrag;
}

export function selectGraphState(graphId: string) {
    return (state: StoreState): GraphEditorState | undefined => {
        return state.editor[graphId];
    }; 
}

export function selectGraphNodes(graphId: string) {
    return (state: StoreState): { [id: string]: GraphNode } | undefined => {
        return state.editor[graphId]?.graph.nodes;
    };
}

export function selectNodeDrag(graphId: string) {
    return (state: StoreState): NodeDrag | undefined => {
        return state.editor[graphId]?.nodeDrag;
    };
}

