
export type NodeState = {
    x: number;
    y: number;
}

export type State = {
    nodes: {
        [id: string]: NodeState | undefined;
    }
}

export enum ActionType {
    SET_NODE_POSITION,
    CLEAR_NODE_STATE
}

export type Action = 
    | { type: ActionType.SET_NODE_POSITION, nodeId: string, x: number, y: number }
    | { type: ActionType.CLEAR_NODE_STATE, nodeId: string };

export function init(): State {
    return { nodes: {} };
}

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SET_NODE_POSITION:{
            const nodes = { ...state.nodes };
            nodes[action.nodeId] = { x: action.x, y: action.y };
            return { nodes };
        }
        
        case ActionType.CLEAR_NODE_STATE: {
            const nodes = { ...state.nodes };
            delete nodes[action.nodeId];
            return { nodes };
        }

        default:
            return state;
    }
}
