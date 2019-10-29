import { produce } from 'immer';
import { Graph } from "../graph/types/graphTypes";
import { GraphAction, ActionType, SetNodePositionAction, setNodeFieldValueAction, RemoveNodeAction } from "./graphActions";
import { GraphState } from './storeTypes';

const INIT_GRAPH_STATE: Graph = {
    nodes: {
        groupBy: {
            title: 'Group-By',
            type: 'group',
            fields: {},
            x: 10,
            y: 30,
            ports: {
                in: {},
                out: {
                    rows: {
                        node: 'sum',
                        port: 'in'
                    }
                }
            }
        },
        sum: {
            title: 'Sum',
            type: 'sum',
            fields: {},
            x: 110,
            y: 50,
            ports: {
                in: {},
                out: {}
            }
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
        case ActionType.SET_NODE_POSITION:
            return setNodePosition(state, action);
            
        case ActionType.SET_NODE_FIELD_VALUE:
            return setNodeFieldValue(state, action);

        case ActionType.REMOVE_NODE:
            return removeNode(state, action);

        default:
            return state;
    }
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

function setNodeFieldValue(state: GraphState, action: setNodeFieldValueAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const node = graph.nodes[action.nodeId];
        if (node == null) return;

        node.fields[action.fieldName] = action.value;
    });
}

function removeNode(state: GraphState, action: RemoveNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        delete graph.nodes[action.nodeId];
    });
}
