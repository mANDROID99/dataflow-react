import { GraphEditorState } from "../types/storeTypes";
import { Graph } from "../types/graphTypes";

function createInitialGraph(): Graph {
    return {
        nodes: {}
    };
}

export function createInitialState(): GraphEditorState {
    const graph = createInitialGraph();

    return {
        graph,
        contextMenu: undefined,
        scrollX: 0,
        scrollY: 0,
        scrolling: false,
        selectedNode: undefined,
        portDrag: undefined
    };
}
