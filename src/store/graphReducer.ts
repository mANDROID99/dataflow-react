import { produce } from 'immer';
import { Graph } from "../graph/types/graphTypes";
import { GraphAction, ActionType, SetNodePositionAction, setNodeFieldValueAction, RemoveNodeAction, RemoveNodeConnectionAction, CreateNodeConnectionAction } from "./graphActions";
import { GraphState } from './storeTypes';

const INIT_GRAPH_STATE: Graph = {
    nodes: {
        groupBy: {
            id: 'groupBy',
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
            id: 'sum',
            title: 'Sum',
            type: 'sum',
            fields: {},
            x: 300,
            y: 100,
            ports: {
                in: {
                    in: {
                        node: 'groupBy',
                        port: 'rows'
                    }
                },
                out: {}
            }
        },
        sum2: {
            id: 'sum2',
            title: 'Sum',
            type: 'sum',
            fields: {},
            x: 250,
            y: 200,
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

        case ActionType.REMOVE_NODE_CONNECTION:
            return removeNodeConnection(state, action);

        case ActionType.CREATE_NODE_CONNECTION:
            return createNodeConnection(state, action);

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

function removeNodeConnection(state: GraphState, action: RemoveNodeConnectionAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const start = action.start;

        const startNode = graph.nodes[start.nodeId];
        if (startNode == null) return;

        const startPorts = start.portOut ? startNode.ports.out : startNode.ports.in;
        const startPort = startPorts[start.portName];
        
        if (startPort != null) {
            delete startPorts[start.portName];
            clearPort(graph, startPort.node, !start.portOut, startPort.port);
        }
    });
}

function createNodeConnection(state: GraphState, action: CreateNodeConnectionAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;

        const start = action.start;
        const end = action.end;

        const startNode = graph.nodes[start.nodeId];
        if (startNode == null) return;

        const startPorts = start.portOut ? startNode.ports.out : startNode.ports.in;
        const startPort = startPorts[start.portName];
        if (startPort != null) {
            clearPort(graph, startPort.node, !start.portOut, startPort.port);
        }

        startPorts[start.portName] = {
            node: end.nodeId,
            port: end.portName
        };

        const endNode = graph.nodes[end.nodeId];
        if (endNode == null) return;

        const endPorts = end.portOut ? endNode.ports.out : endNode.ports.in;
        const endPort = endPorts[end.portName];
        if (endPort != null) {
            clearPort(graph, endPort.node, !end.portOut, endPort.port);
        }
        
        endPorts[end.portName] = {
            node: start.nodeId,
            port: start.portName
        };
    });
}

function removeNode(state: GraphState, action: RemoveNodeAction): GraphState {
    return produce(state, (draft) => {
        const graph = draft.graphs[action.graphId];
        if (graph == null) return;
        delete graph.nodes[action.nodeId];
    });
}


function clearPort(graph: Graph, nodeId: string, portOut: boolean, portName: string) {
    const node = graph.nodes[nodeId];
    if (node == null) return;

    const ports = portOut ? node.ports.out : node.ports.in;
    ports[portName] = undefined;
}
