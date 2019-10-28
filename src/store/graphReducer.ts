import { produce } from 'immer';
import { Graph } from "../graph/types/graphTypes";
import { GraphAction, ActionType, CreateNodeAction, UpdateNodeAction, RemoveNodeAction } from "./graphActions";
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
        case ActionType.CREATE_NODE:
            return createNode(state, action);
            
        case ActionType.UPDATE_NODE:
            return updateNode(state, action);

        case ActionType.REMOVE_NODE:
            return removeNode(state, action);

        default:
            return state;
    }
}

function createNode(state: GraphState, action: CreateNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        graph.nodes[action.nodeId] = action.node;
    });
}

function updateNode(state: GraphState, action: UpdateNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        graph.nodes[action.nodeId] = action.node;
    });
}

function removeNode(state: GraphState, action: RemoveNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        delete graph.nodes[action.nodeId];
    });
}
