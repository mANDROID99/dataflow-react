import produce from "immer";

import { GraphNode, Graph } from "./types/graphTypes";
import { NodeState, GraphState, GraphActionType, GraphAction } from "./types/graphStateTypes";

function createNodeState(node: GraphNode): NodeState {
    return {
        dragging: false,
        portsIn: {},
        portsOut: {}
    };
}

export function init(graph: Graph): GraphState {
    const graphNodes = graph.nodes;
    const nodes: { [id: string]: NodeState } = {};

    for (let [nodeId, graphNode] of Object.entries(graphNodes)) {
        nodes[nodeId] = createNodeState(graphNode);
    }

    return { graph, nodes };
}

export function reducer(state: GraphState, action: GraphAction): GraphState {
    switch (action.type) {
        case GraphActionType.INIT:
            return init(action.graph);
        
        case GraphActionType.BEGIN_NODE_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;

                node.drag = undefined;
                node.dragging = true;
            });

        case GraphActionType.UPDATE_NODE_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;
                
                node.drag = { x: action.x, y: action.y };
            });

        case GraphActionType.CLEAR_NODE_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;

                node.drag = undefined;
                node.dragging = false;
            });

        case GraphActionType.BEGIN_PORT_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;

                const ports = action.portIn ? node.portsIn : node.portsOut;
                const port = ports[action.portName];
                if (!port) return;

                port.drag = undefined;
                port.dragging = true;
            });

        case GraphActionType.UPDATE_PORT_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;

                const ports = action.portIn ? node.portsIn : node.portsOut;
                const port = ports[action.portName];
                if (!port) return;

                port.drag = { x: action.x, y: action.y };
            });

        case GraphActionType.CLEAR_PORT_DRAG:
            return produce(state, (state) => {
                const node = state.nodes[action.nodeId];
                if (!node) return;

                const ports = action.portIn ? node.portsIn : node.portsOut;
                const port = ports[action.portName];
                if (!port) return;

                port.drag = undefined;
                port.dragging = false;
            });

        default:
            return state;
    }
}
