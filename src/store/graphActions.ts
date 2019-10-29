export enum ActionType {
    SET_NODE_POSITION = 'node-graph.SET_NODE_POSITION',
    SET_NODE_FIELD_VALUE = 'node-graph.SET_NODE_FIELD_VALUE',
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
    CLEAR_NODE_CONNECTION = 'node-graph.CLEAR_NODE_CONNECTION'
}

export function setNodePosition(graphId: string, nodeId: string, x: number, y: number): SetNodePositionAction {
    return {
        type: ActionType.SET_NODE_POSITION,
        graphId,
        nodeId,
        x,
        y
    };
}

export function setNodeFieldValue(graphId: string, nodeId: string, fieldName: string, value: unknown): setNodeFieldValueAction {
    return {
        type: ActionType.SET_NODE_FIELD_VALUE,
        graphId,
        nodeId,
        fieldName,
        value
    };
}

export function clearNodeConnection(graphId: string, nodeId: string, portName: string, portOut: boolean): ClearNodeConnectionAction {
    return {
        type: ActionType.CLEAR_NODE_CONNECTION,
        graphId,
        nodeId,
        portName,
        portOut
    };
}

export function removeNode(graphId: string, nodeId: string): RemoveNodeAction {
    return {
        type: ActionType.REMOVE_NODE,
        graphId,
        nodeId
    };
}

export type SetNodePositionAction = {
    type: ActionType.SET_NODE_POSITION;
    graphId: string;
    nodeId: string;
    x: number;
    y: number;
}

export type setNodeFieldValueAction = {
    type: ActionType.SET_NODE_FIELD_VALUE;
    graphId: string;
    nodeId: string;
    fieldName: string;
    value: unknown;
}

export type ClearNodeConnectionAction = {
    type: ActionType.CLEAR_NODE_CONNECTION;
    graphId: string;
    nodeId: string;
    portName: string;
    portOut: boolean;
}

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graphId: string;
    nodeId: string;
}

export type GraphAction =
    SetNodePositionAction |
    setNodeFieldValueAction |
    ClearNodeConnectionAction |
    RemoveNodeAction;
