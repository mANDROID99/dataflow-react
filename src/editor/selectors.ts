import { StoreState, PortDrag, NodeDrag, GraphEditorState } from "../store/storeTypes";
import { GraphNode, Graph, TargetPort } from "../types/graphTypes";

export function selectEditorState(state: StoreState, graphId: string): GraphEditorState | undefined {
    return state.editor[graphId]; 
}

export function selectPortDrag(state: StoreState, graphId: string): PortDrag | undefined {
    return selectEditorState(state, graphId)?.portDrag;
}

export function selectGraph(state: StoreState, graphId: string): Graph | undefined {
    return selectEditorState(state, graphId)?.graph;
}

export function selectGraphNodes(state: StoreState, graphId: string): { [id: string]: GraphNode } | undefined {
    return selectGraph(state, graphId)?.nodes;
}

export function selectNodeDrag(state: StoreState, graphId: string): NodeDrag | undefined {
    return selectEditorState(state, graphId)?.nodeDrag;
}

export function selectGraphNode(state: StoreState, graphId: string, nodeId: string): GraphNode | undefined {
    return selectGraphNodes(state, graphId)?.[nodeId];
}

export function selectPortTargets(state: StoreState, graphId: string, nodeId: string, portId: string, portOut: boolean): TargetPort[] | undefined {
    const ports = selectGraphNode(state, graphId, nodeId)?.ports
    if (ports != null) {
        return (portOut ? ports.out : ports.in)[portId];
    }
}
