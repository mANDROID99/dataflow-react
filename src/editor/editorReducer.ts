import { produce } from 'immer';
import { Graph, TargetPort } from '../types/graphTypes';
import { GraphAction, ActionType, setFieldValueAction, RemoveNodeAction, StartPortDragAction, SetPortDragTargetAction, UnsetPortDragTargetAction, UpdatePortDragAction, EndPortDragAction, StartNodeDragAction, UpdateNodeDragAction, EndNodeDragAction, MountPortAction, UnmountPortAction, CreateNodeAction } from "./editorActions";
import { PortRef, GraphEditorStates } from '../types/storeTypes';
import { comparePortRefs, getPortKeyFromRef } from './helpers/portHelpers';
import { v4 } from 'uuid';
import { INIT_STATE } from '../data/graphState';

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

function clearPort(graph: Graph, port: PortRef): void {
    const portOut = port.portOut;
    const portId = port.portId;
    const nodeId = port.nodeId;
    const node = graph.nodes[nodeId];
    if (node == null) return;

    const ports = portOut ? node.ports.out : node.ports.in;
    const portTargets = ports[port.portId];

    if (portTargets) {
        ports[portId] = undefined;
        clearPortTargets(graph, portTargets, nodeId, portOut);
    }
}

function createConnection(graph: Graph, start: PortRef, end: PortRef): void {
    const nodeId = start.nodeId;
    const portId = start.portId;
    const portOut = start.portOut;

    const endNodeId = end.nodeId;
    const endPortId = end.portId;

    const node = graph.nodes[nodeId];
    const targetNode = graph.nodes[endNodeId];
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
            node: endNodeId,
            port: endPortId
        });

        // add connection target -> node
        const targetPorts = targetNode.ports.in;
        targetPorts[endPortId] = [{
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
            node: endNodeId,
            port: endPortId
        }];

        // add connection target -> node
        const targetPorts = targetNode.ports.out;
        let targetPort = targetPorts[endPortId];
        if (!targetPort) {
            targetPort = [];
            targetPorts[endPortId] = targetPort;
        }

        targetPort.push({
            node: nodeId,
            port: portId
        });
    }
}

const handleStartNodeDrag = produce((state: GraphEditorStates, action: StartNodeDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    graphState.nodeDrag = {
        node: action.node,
        dragX: 0,
        dragY: 0
    };
});

const handleUpdateNodeDrag = produce((state: GraphEditorStates, action: UpdateNodeDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const nodeDrag = graphState.nodeDrag;
    if (!nodeDrag) return;

    nodeDrag.dragX = action.dragX;
    nodeDrag.dragY = action.dragY;
});

const handleEndNodeDrag = produce((state: GraphEditorStates, action: EndNodeDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const nodeDrag = graphState.nodeDrag;
    if (!nodeDrag) return;

    graphState.nodeDrag = undefined;

    const node = graphState.graph.nodes[nodeDrag.node];
    if (!node) return;

    node.x += nodeDrag.dragX;
    node.y += nodeDrag.dragY;
});

const handleCreateNode = produce((state: GraphEditorStates, action: CreateNodeAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    const node = action.node;

    const nodeId = v4();
    graph.nodes[nodeId] = node;
});

const handleRemoveNode = produce((state: GraphEditorStates, action: RemoveNodeAction) => {
    const graphState = state[action.graph];
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

const handleSetNodeFieldValue = produce((state: GraphEditorStates, action: setFieldValueAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const graph = graphState.graph;
    const node = graph.nodes[action.node];
    if (!node) return;

    node.fields[action.field] = action.value;
});

const handleStartPortDrag = produce((state: GraphEditorStates, action: StartPortDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const port = action.port;
    if (!port.portOut) {
        clearPort(graphState.graph, action.port);
    }

    graphState.portDrag = {
        port: action.port,
        mouseX: action.mouseX,
        mouseY: action.mouseY
    };
});

const handleUpdatePortDrag = produce((state: GraphEditorStates, action: UpdatePortDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    portDrag.mouseX = action.mouseX;
    portDrag.mouseY = action.mouseY;
});

const handleEndPortDrag = produce((state: GraphEditorStates, action: EndPortDragAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    graphState.portDrag = undefined;
    const target = portDrag.target;

    if (target) {
        createConnection(graphState.graph, portDrag.port, target);
    }
}); 

const handleSetPortDragTarget = produce((state: GraphEditorStates, action: SetPortDragTargetAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    portDrag.target = action.port;
});

const handleUnsetPortDragTarget = produce((state: GraphEditorStates, action: UnsetPortDragTargetAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const portDrag = graphState.portDrag;
    if (!portDrag) return;

    const target = portDrag.target;
    if (target && comparePortRefs(target, action.port)) {
        portDrag.target = undefined;
    }
});

const handleMountPort = produce((state: GraphEditorStates, action: MountPortAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const port = action.port;
    const portKey = getPortKeyFromRef(port);

    graphState.ports[portKey] = {
        offsetX: action.xOff,
        offsetY: action.yOff
    };
});

const handleUnmountPort = produce((state: GraphEditorStates, action: UnmountPortAction) => {
    const graphState = state[action.graph];
    if (!graphState) return;

    const port = action.port;
    const portKey = getPortKeyFromRef(port);
    delete graphState.ports[portKey];
});

export default function(state: GraphEditorStates = INIT_STATE, action: GraphAction): GraphEditorStates {
    switch (action.type) {
        case ActionType.CREATE_NODE:
            return handleCreateNode(state, action);
        case ActionType.REMOVE_NODE:
            return handleRemoveNode(state, action);
        case ActionType.START_NODE_DRAG:
            return handleStartNodeDrag(state, action);
        case ActionType.UPDATE_NODE_DRAG:
            return handleUpdateNodeDrag(state, action);
        case ActionType.END_NODE_DRAG:
            return handleEndNodeDrag(state, action);
        case ActionType.START_PORT_DRAG:
            return handleStartPortDrag(state, action);
        case ActionType.UPDATE_PORT_DRAG:
            return handleUpdatePortDrag(state, action);
        case ActionType.END_PORT_DRAG:
            return handleEndPortDrag(state, action);
        case ActionType.SET_PORT_DRAG_TARGET:
            return handleSetPortDragTarget(state, action);
        case ActionType.UNSET_PORT_DRAG_TARGET:
            return handleUnsetPortDragTarget(state, action);
        case ActionType.MOUNT_PORT:
            return handleMountPort(state, action);
        case ActionType.UNMOUNT_PORT:
            return handleUnmountPort(state, action);
        case ActionType.SET_NODE_FIELD_VALUE:
            return handleSetNodeFieldValue(state, action);  
        default:
            return state;
    }
}
