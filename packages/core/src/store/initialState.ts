import { GraphEditorState } from "../types/storeTypes";
import { Graph } from "../types/graphTypes";

function createInitialGraph(): Graph {
    return {
        nodes: {},
        nodeIds: []
    };
}

export function createInitialState(): GraphEditorState {
    const graph = createInitialGraph();
    return {
        graph,
        contextMenu: undefined,
        selectedNode: undefined,
        portDrag: undefined,
        nodeBounds: {}
    };
}
