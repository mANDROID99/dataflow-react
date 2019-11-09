import { produce } from 'immer';
import { Graph, TargetPort } from "../graph/types/graphTypes";
import { GraphAction, ActionType, SetNodePositionAction, setNodeFieldValueAction, RemoveNodeAction, ClearPortConnectionsAction, AddPortConnectionAction, StartPortDragAction, ClearPortDragAction, SetPortDragTargetAction, ClearPortDragTargetAction } from "../graph2/graphActions";
import { GraphsState } from './storeTypes';

const INIT_GRAPH: Graph = {
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

const INIT_STATE: GraphsState = {
    graphs: {
        'graph-1': {
            graph: INIT_GRAPH
        }
    }
};

function clearPortTargets(graph: Graph, targets: TargetPort[], nodeId: string, portOut: boolean): void {
    for (const target of targets) {
        const targetNode = graph.nodes[target.node];
        if (!targetNode) continue;

        const ports = portOut ? targetNode.ports.in : targetNode.ports.out;
        const targetPorts = ports[target.port];
        if (!targetPorts) continue;

        const index = targetPorts.findIndex(p => p.node === nodeId);
        if (index < 0) continue;

        targetPorts.splice(index, 1);
    }
}

function clearPort(graph: Graph, nodeId: string, portId: string, portOut: boolean): void {
    const node = graph.nodes[nodeId];
    if (node == null) return;

    const ports = portOut ? node.ports.out : node.ports.in;
    const portTargets = ports[portId];
    if (portTargets) {
        ports[portId] = undefined;
        clearPortTargets(graph, portTargets, nodeId, portOut);
    }
}

const removeNode = produce((state: GraphsState, action: RemoveNodeAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    const nodeId = action.node;
    const node = graph.nodes[nodeId];
    if (!node) return;

    // clear out ports
    for (const portName in node.ports.out) {
        const targets = node.ports.out[portName];
        if (targets) {
            clearPortTargets(graph, targets, nodeId, true);
        }
    }

    // clear in ports
    for (const portId in node.ports.in) {
        const targets = node.ports.in[portId];
        if (targets) {
            clearPortTargets(graph, targets, nodeId, false);
        }
    }

    delete graph.nodes[nodeId];
});

const setNodePosition = produce((state: GraphsState, action: SetNodePositionAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    const node = graph.nodes[action.node];
    if (!node) return;

    node.x = action.x;
    node.y = action.y;
});

const setNodeFieldValue = produce((state: GraphsState, action: setNodeFieldValueAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    const node = graph.nodes[action.node];
    if (!node) return;

    node.fields[action.field] = action.value;
});

const clearPortConnections = produce((state: GraphsState, action: ClearPortConnectionsAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    clearPort(graph, action.node, action.port, action.portOut);
});

const addPortConnection = produce((state: GraphsState, action: AddPortConnectionAction) => {
    const graphId = action.graph;
    const nodeId = action.node;
    const portId = action.port;
    const portOut = action.portOut;
    const targetNodeId = action.targetNode;
    const targetPortId = action.targetPort;

    const graphState = state.graphs[graphId];
    if (!graphState) return;

    const graph = graphState.graph;
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
            clearPortTargets(graph, targets, nodeId, false);
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

const startPortDrag = produce((state: GraphsState, action: StartPortDragAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    graphState.portDrag = {
        nodeId: action.node,
        portId: action.port,
        portOut: action.portOut,
        portType: action.portType
    };
});

const clearPortDrag = produce((state: GraphsState, action: ClearPortDragAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;
    graphState.portDrag = undefined;
});

const setPortDragTarget = produce((state: GraphsState, action: SetPortDragTargetAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    portDrag.target = {
        nodeId: action.node,
        portId: action.port
    };
});

const clearPortDragTarget = produce((state: GraphsState, action: ClearPortDragTargetAction) => {
    const graphState = state.graphs[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    const target = portDrag.target;
    if (target && target.nodeId === action.node && target.portId === action.port) {
        portDrag.target = undefined;
    }
});

export default function(state: GraphsState = INIT_STATE, action: GraphAction): GraphsState {
    switch (action.type) {
        case ActionType.START_PORT_DRAG:
            return startPortDrag(state, action);

        case ActionType.CLEAR_PORT_DRAG:
            return clearPortDrag(state, action);

        case ActionType.SET_PORT_DRAG_TARGET:
            return setPortDragTarget(state, action);

        case ActionType.CLEAR_PORT_DRAG_TARGET:
            return clearPortDragTarget(state, action);

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
