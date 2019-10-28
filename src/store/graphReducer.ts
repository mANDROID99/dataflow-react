import { produce } from 'immer';
import { Graph } from "../graph/graphTypes";
import { GraphAction, ActionType, RemoveNodeAction, SetNodePositionAction, SetNodeFieldValueAction, NodePortStartDragAction, NodePortEndDragAction } from "./graphActions";
import { GraphState } from './storeTypes';

const INIT_GRAPH_STATE: Graph = {
    nodes: {
        groupBy: {
            title: 'Group-By',
            type: 'group',
            values: {},
            x: 10,
            y: 30,
            portsIn: {},
            portsOut: {}
        },
        sum: {
            title: 'Sum',
            type: 'sum',
            values: {},
            x: 110,
            y: 50,
            portsIn: {},
            portsOut: {}
        }
    }
}

const INIT_STATE: GraphState = {
    graphs: {
        'graph-1': INIT_GRAPH_STATE
    }
}

export default function(state: GraphState = INIT_STATE, action: GraphAction): GraphState {
    switch (action.type) {
        case ActionType.REMOVE_NODE:
            return removeNode(state, action);
        case ActionType.SET_NODE_POSITION:
            return setNodePosition(state, action);
        case ActionType.SET_NODE_FIELD_VALUE:
            return setNodeFieldValue(state, action);
        case ActionType.NODE_PORT_START_DRAG:
            return nodePortStartDrag(state, action);
        case ActionType.NODE_PORT_END_DRAG:
            return nodePortEndDrag(state, action);
        default:
            return state;
    }
}

function removeNode(state: GraphState, action: RemoveNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        delete graph.nodes[action.nodeId];
    });
}

function setNodePosition(state: GraphState, action: SetNodePositionAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const node = graph.nodes[action.nodeId];
        if (node == null) return;

        node.x = action.x;
        node.y = action.y;
    });
}

function setNodeFieldValue(state: GraphState, action: SetNodeFieldValueAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const node = graph.nodes[action.nodeId];
        if (node == null) return;

        node.values[action.fieldName] = action.value;
    });
}

function nodePortStartDrag(state: GraphState, action: NodePortStartDragAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const node = graph.nodes[action.nodeId];
        if (node == null) return;

        const ports = action.portOut ? node.portsOut : node.portsIn;
        ports[action.portName] = { dragging: true };
    });
}

function nodePortEndDrag(state: GraphState, action: NodePortEndDragAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const node = graph.nodes[action.nodeId];
        if (node == null) return;

        const ports = action.portOut ? node.portsOut : node.portsIn;
        ports[action.portName] = { dragging: false };
    });
}
