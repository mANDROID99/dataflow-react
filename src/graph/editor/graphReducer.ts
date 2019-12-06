import { produce } from 'immer';
import { Graph } from "../types/graphTypes";

import {
    GraphState,
    GraphAction,
    GraphActionType,
    NodeDragUpdateAction,
    NodeDragBeginAction,
    NodeDragEndAction
} from "../types/graphStateTypes";

export function init(graph: Graph): GraphState {
    return {
        graph,
        initialGraph: graph,
        nodeDrag: undefined,
        portDrag: undefined
    };
}

const handleNodeDragBegin = produce((state: GraphState, action: NodeDragBeginAction) => {
    state.nodeDrag = {
        nodeId: action.nodeId,
        dragX: 0,
        dragY: 0
    }
});

const handleNodeDragUpdate = produce((state: GraphState, action: NodeDragUpdateAction) => {
    const nodeDrag = state.nodeDrag;
    if (nodeDrag) {
        nodeDrag.dragX = action.dx;
        nodeDrag.dragY = action.dy;
    }
});

const handleNodeDragFinish = produce((state: GraphState, action: NodeDragEndAction) => {
    const nodeDrag = state.nodeDrag;
    if (nodeDrag) {
        const node = state.graph.nodes[nodeDrag.nodeId];
        node.x += nodeDrag.dragX;
        node.y += nodeDrag.dragY;
        state.nodeDrag = undefined;
    }
});

export function reducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case GraphActionType.INIT:
            return init(action.graph);
        case GraphActionType.NODE_DRAG_BEGIN:
            return handleNodeDragBegin(state, action);
        case GraphActionType.NODE_DRAG_UPDATE:
            return handleNodeDragUpdate(state, action);
        case GraphActionType.NODE_DRAG_FINISH:
            return handleNodeDragFinish(state, action);
        default:
            return state;
    }
}
