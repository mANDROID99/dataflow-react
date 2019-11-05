import { produce } from 'immer';
import { Graph, TargetPort } from "../graph/types/graphTypes";
import { GraphAction, ActionType, SetNodePositionAction, setNodeFieldValueAction, RemoveNodeAction, ClearPortConnectionsAction, AddPortConnectionAction } from "./graphActions";
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
                    rows: [{
                        node: 'sum',
                        port: 'in'
                    }]
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
                    in: [{
                        node: 'groupBy',
                        port: 'rows'
                    }]
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
};

const INIT_STATE: GraphState = {
    graphs: {
        'graph-1': INIT_GRAPH_STATE
    }
};

function clearPort(graph: Graph, portTargets: TargetPort[], nodeId: string, portOut: boolean): void {
    for (const target of portTargets) {
        const targetNode = graph.nodes[target.node];
        if (!targetNode) continue;

        const ports = portOut ? targetNode.ports.out : targetNode.ports.in;
        const targetPorts = ports[target.port];
        if (!targetPorts) continue;

        
        const index = targetPorts.findIndex(p => p.node === nodeId);
        if (index < 0) continue;

        targetPorts.splice(index, 1);
    }
}

const removeNode = produce((state: GraphState, action: RemoveNodeAction) => {
    const graph = state.graphs[action.graph];
    if (!graph) return;

    const nodeId = action.node;
    const node = graph.nodes[nodeId];
    if (!node) return;

    // clear out ports
    for (const portName in node.ports.out) {
        const targets = node.ports.out[portName];
        if (targets) {
            clearPort(graph, targets, nodeId, true);
        }
    }

    // clear in ports
    for (const portId in node.ports.in) {
        const targets = node.ports.in[portId];
        if (targets) {
            clearPort(graph, targets, nodeId, false);
        }
    }

    delete graph.nodes[nodeId];
});

const setNodePosition = produce((state: GraphState, action: SetNodePositionAction) => {
    const graph = state.graphs[action.graph];
    if (!graph) return;

    const node = graph.nodes[action.node];
    if (!node) return;

    node.x = action.x;
    node.y = action.y;
});

const setNodeFieldValue = produce((state: GraphState, action: setNodeFieldValueAction) => {
    const graph = state.graphs[action.graph];
    if (!graph) return;

    const node = graph.nodes[action.node];
    if (!node) return;

    node.fields[action.field] = action.value;
});

const clearPortConnections = produce((state: GraphState, action: ClearPortConnectionsAction) => {
    const graph = state.graphs[action.graph];
    if (!graph) return;

    const nodeId = action.node;
    const node = graph.nodes[nodeId];
    if (!node) return;

    if (action.portOut) {
        const targets = node.ports.out[action.port];
        if (targets) {
            clearPort(graph, targets, nodeId, true);
        }

    } else {
        const targets = node.ports.in[action.port];
        if (targets) {
            clearPort(graph, targets, nodeId, false);
        }
    }
});

const addPortConnection = produce((state: GraphState, action: AddPortConnectionAction) => {
    const graphId = action.graph;
    const nodeId = action.node;
    const portId = action.port;
    const portOut = action.portOut;
    const targetNodeId = action.targetNode;
    const targetPortId = action.targetPort;

    const graph = state.graphs[graphId];
    if (!graph) return;

    const node = graph.nodes[nodeId];
    const targetNode = graph.nodes[targetNodeId];
    if (!node || !targetNode) return;

    if (portOut) {
        // add connection node -> target
        const ports = node.ports.out;
        let targets = ports[portId];
        if (!targets) {
            targets = [];
            ports[portId] = targets;
        }
        
        targets.push({
            node: targetNodeId,
            port: targetPortId
        });

        // add connection target -> node
        const targetPorts = targetNode.ports.in;
        targetPorts[targetPortId] = [{
            node: nodeId,
            port: portId
        }];

    } else {
        // clear previous connection
        const ports = node.ports.in;
        const targets = ports[portId];
        if (targets) {
            clearPort(graph, targets, nodeId, false);
        }

        // add connection node -> target
        ports[portId] = [{
            node: targetNodeId,
            port: targetPortId
        }];

        // add connection target -> node
        const targetPorts = targetNode.ports.out;
        let targetPort = targetPorts[targetPortId];
        if (!targetPort) {
            targetPort = [];
            targetPorts[targetPortId] = targetPort;
        }

        targetPort.push({
            node: nodeId,
            port: portId
        });
    }
});

export default function(state: GraphState = INIT_STATE, action: GraphAction): GraphState {
    switch (action.type) {
        case ActionType.REMOVE_NODE:
            return removeNode(state, action);

        case ActionType.SET_NODE_POSITION:
            return setNodePosition(state, action);

        case ActionType.SET_NODE_FIELD_VALUE:
            return setNodeFieldValue(state, action);

        case ActionType.CLEAR_PORT_CONNECTIONS:
            return clearPortConnections(state, action);

        case ActionType.ADD_PORT_CONNECTION:
            return addPortConnection(state, action);

        default:
            return state;
    }
}
