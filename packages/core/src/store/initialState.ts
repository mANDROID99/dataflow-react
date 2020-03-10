import { Graph } from "../types/graphTypes";
import { GraphEditorState } from "../types/storeTypes";

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
        nodeBounds: {},
        autoUpdate: false
    };
}
