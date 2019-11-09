export enum ActionType {
    START_PORT_DRAG = 'node-graph.START_PORT_DRAG',
    CLEAR_PORT_DRAG = 'node-graph.CLEAR_PORT_DRAG',
    SET_PORT_DRAG_TARGET = 'node-graph.SET_PORT_DRAG_TARGET',
    CLEAR_PORT_DRAG_TARGET = 'node-graph.CLEAR_PORT_DRAG_TARGET',
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
    SET_NODE_POSITION = 'node-graph.SET_NODE_POSITION',
    SET_NODE_FIELD_VALUE = 'node-graph.SET_NODE_FIELD_VALUE',
    CLEAR_PORT_CONNECTIONS = 'node-graph.CLEAR_PORT_CONNECTIONS',
    ADD_PORT_CONNECTION = 'node-graph.ADD_PORT_CONNECTION'
}

export function startPortDrag(graph: string, node: string, port: string, portOut: boolean, portType: string): StartPortDragAction {
    return {
        type: ActionType.START_PORT_DRAG,
        graph,
        node,
        port,
        portOut,
        portType
    };
}

export function clearPortDrag(graph: string): ClearPortDragAction {
    return {
        type: ActionType.CLEAR_PORT_DRAG,
        graph
    };
}

export function setPortDragTarget(graph: string, node: string, port: string): SetPortDragTargetAction {
    return {
        type: ActionType.SET_PORT_DRAG_TARGET,
        graph,
        node,
        port
    };
}

export function clearPortDragTarget(graph: string, node: string, port: string): ClearPortDragTargetAction {
    return {
        type: ActionType.CLEAR_PORT_DRAG_TARGET,
        graph,
        node,
        port
    };
}

export function removeNode(graph: string, node: string): RemoveNodeAction {
    return {
        type: ActionType.REMOVE_NODE,
        graph,
        node
    };
}

export function setNodePosition(graph: string, node: string, x: number, y: number): SetNodePositionAction {
    return {
        type: ActionType.SET_NODE_POSITION,
        graph,
        node,
        x,
        y
    };
}

export function setNodeFieldValue(graph: string, node: string, field: string, value: unknown): setNodeFieldValueAction {
    return {
        type: ActionType.SET_NODE_FIELD_VALUE,
        graph,
        node,
        field,
        value
    };
}

export function clearPortConnections(graph: string, node: string, port: string, portOut: boolean): ClearPortConnectionsAction {
    return {
        type: ActionType.CLEAR_PORT_CONNECTIONS,
        graph,
        node,
        port,
        portOut
    };
}

export function addPortConnection(graph: string, node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): AddPortConnectionAction {
    return {
        type: ActionType.ADD_PORT_CONNECTION,
        graph,
        node,
        port,
        portOut,
        targetNode,
        targetPort
    };
}

export type SetPortDragTargetAction = {
    type: ActionType.SET_PORT_DRAG_TARGET;
    graph: string;
    node: string;
    port: string;
}

export type ClearPortDragTargetAction = {
    type: ActionType.CLEAR_PORT_DRAG_TARGET;
    graph: string;
    node: string;
    port: string;
}

export type StartPortDragAction = {
    type: ActionType.START_PORT_DRAG;
    graph: string;
    node: string;
    port: string;
    portOut: boolean;
    portType: string;
}

export type ClearPortDragAction = {
    type: ActionType.CLEAR_PORT_DRAG;
    graph: string;
}

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graph: string;
    node: string;
}

export type SetNodePositionAction = {
    type: ActionType.SET_NODE_POSITION;
    graph: string;
    node: string;
    x: number;
    y: number;
}

export type setNodeFieldValueAction = {
    type: ActionType.SET_NODE_FIELD_VALUE;
    graph: string;
    node: string;
    field: string;
    value: unknown;
}

export type ClearPortConnectionsAction = {
    type: ActionType.CLEAR_PORT_CONNECTIONS;
    graph: string;
    node: string;
    port: string;
    portOut: boolean;
}

export type AddPortConnectionAction = {
    type: ActionType.ADD_PORT_CONNECTION;
    graph: string;
    node: string;
    port: string;
    portOut: boolean;
    targetNode: string;
    targetPort: string;
}

export type GraphAction =
    | SetPortDragTargetAction
    | ClearPortDragTargetAction
    | StartPortDragAction
    | ClearPortDragAction
    | RemoveNodeAction
    | SetNodePositionAction 
    | setNodeFieldValueAction 
    | ClearPortConnectionsAction 
    | AddPortConnectionAction
