
export enum ActionType {
    CHANGE_ITEM,
    REMOVE_ITEM,
    ADD_ITEM
}

export type AddItemAction = {
    type: ActionType.ADD_ITEM;
    value: unknown;
}

export type ChangeItemAction = {
    type: ActionType.CHANGE_ITEM;
    index: number;
    value: unknown;
}

export type RemoveItemAction = {
    type: ActionType.REMOVE_ITEM;
    index: number;
}

export type Action = AddItemAction | ChangeItemAction | RemoveItemAction;

export function reducer(state: unknown[], action: Action): unknown[] {
    switch (action.type) {
        case ActionType.ADD_ITEM:
            state = state.slice(0);
            state.push(action.value);
            return state;

        case ActionType.CHANGE_ITEM:
            state = state.slice(0);
            state[action.index] = action.value;
            return state;

        case ActionType.REMOVE_ITEM:
            state = state.slice(0);
            state.splice(action.index, 1);
            return state;

        default:
            return state;
    }
}
