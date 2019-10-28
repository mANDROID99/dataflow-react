import { GraphNode } from "../graph/types/graphTypes";

export enum ActionType {
    CREATE_NODE = 'node-graph.CREATE_NODE',
    UPDATE_NODE = 'node-graph.UPDATE_NODE',
    REMOVE_NODE = 'node-graph.REMOVE_NODE',
}

export function createNode(graphId: string, nodeId: string, node: GraphNode): CreateNodeAction {
    return {
        type: ActionType.CREATE_NODE,
        graphId,
        nodeId,
        node
    };
}

export function updateNode(graphId: string, nodeId: string, node: GraphNode): UpdateNodeAction {
    return {
        type: ActionType.UPDATE_NODE,
        graphId,
        nodeId,
        node
    };
}

export function removeNode(graphId: string, nodeId: string): RemoveNodeAction {
    return {
        type: ActionType.REMOVE_NODE,
        graphId,
        nodeId
    };
}

export type CreateNodeAction = {
    type: ActionType.CREATE_NODE;
    graphId: string;
    nodeId: string;
    node: GraphNode;
}

export type UpdateNodeAction = {
    type: ActionType.UPDATE_NODE;
    graphId: string;
    nodeId: string;
    node: GraphNode;
}

export type RemoveNodeAction = {
    type: ActionType.REMOVE_NODE;
    graphId: string;
    nodeId: string;
}

export type GraphAction = CreateNodeAction | UpdateNodeAction | RemoveNodeAction;
