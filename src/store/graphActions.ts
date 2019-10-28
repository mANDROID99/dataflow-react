
export enum ActionType {
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
    SET_NODE_POSITION = 'node-graph.SET_NODE_POSITION',
    SET_NODE_FIELD_VALUE = 'node-graph.SET_NODE_FIELD_VALUE',
    NODE_PORT_START_DRAG = 'node-graph.NODE_START_DRAG_PORT',
    NODE_PORT_END_DRAG = 'node-graph.NODE_END_DRAG_PORT'
}

export function removeNode(graphId: string, nodeId: string): RemoveNodeAction {
    return {
        type: ActionType.REMOVE_NODE,
        graphId,
        nodeId
    };
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

export function setNodeFieldValue(graphId: string, nodeId: string, fieldName: string, value: unknown): SetNodeFieldValueAction {
    return {
        type: ActionType.SET_NODE_FIELD_VALUE,
        graphId,
        nodeId,
        fieldName,
        value
    };
}

export function nodePortStartDrag(graphId: string, nodeId: string, portOut: boolean, portName: string): NodePortStartDragAction {
    return {
        type: ActionType.NODE_PORT_START_DRAG,
        graphId,
        nodeId,
        portOut,
        portName
    };
}

export function nodePortEndDrag(graphId: string, nodeId: string, portOut: boolean, portName: string): NodePortEndDragAction {
    return {
        type: ActionType.NODE_PORT_END_DRAG,
        graphId,
        nodeId,
        portOut,
        portName
    };
}

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graphId: string;
    nodeId: string;
}

export type SetNodePositionAction = {
    type: ActionType.SET_NODE_POSITION;
    graphId: string;
    nodeId: string;
    x: number;
    y: number;
}

export type SetNodeFieldValueAction = {
    type: ActionType.SET_NODE_FIELD_VALUE,
    graphId: string;
    nodeId: string;
    fieldName: string;
    value: unknown;
}

export type NodePortStartDragAction = {
    type: ActionType.NODE_PORT_START_DRAG,
    graphId: string;
    nodeId: string;
    portOut: boolean;
    portName: string;
}

export type NodePortEndDragAction = {
    type: ActionType.NODE_PORT_END_DRAG,
    graphId: string;
    nodeId: string;
    portOut: boolean;
    portName: string;
}

export type GraphAction =
    RemoveNodeAction |
    SetNodePositionAction |
    SetNodeFieldValueAction |
    NodePortStartDragAction |
    NodePortEndDragAction;
