export enum ActionType {
    SET_NODE_POSITION = 'node-graph.SET_NODE_POSITION',
    SET_NODE_FIELD_VALUE = 'node-graph.SET_NODE_FIELD_VALUE',
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
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

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graphId: string;
    nodeId: string;
}

export type GraphAction = SetNodePositionAction | setNodeFieldValueAction | RemoveNodeAction;
