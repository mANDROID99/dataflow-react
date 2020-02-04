import { Entry } from "../../types/graphInputTypes";

export enum ActionType {
    SET_KEY,
    SET_VALUE,
    PUSH_NEW,
    REMOVE
}

type SetKeyAction = { type: ActionType.SET_KEY; index: number; key: string };
type SetValueAction = { type: ActionType.SET_VALUE; index: number; value: string };
type PushNewAction = { type: ActionType.PUSH_NEW };
type RemoveAction = { type: ActionType.REMOVE; index: number };

export type Action =
    | SetKeyAction
    | SetValueAction
    | PushNewAction
    | RemoveAction;

function handleSetKey(state: Entry<unknown>[], action: SetKeyAction) {
    const prev = state[action.index];
    if (prev) {
        state = state.slice(0);
        state[action.index] = {
            key: action.key,
            value: prev.value
        };
    }
    return state;
}

function handleSetValue(state: Entry<unknown>[], action: SetValueAction) {
    const prev = state[action.index];
    if (prev) {
        state = state.slice(0);
        state[action.index] = {
            key: prev.key,
            value: action.value
        };
    }
    return state;
}

function handlePushNew(state: Entry<unknown>[]) {
    state = state.slice(0);
    state.push({
        key: '',
        value: ''
    });
    return state;
}

function handleRemove(state: Entry<unknown>[], action: RemoveAction) {
    state = state.slice(0);
    state.splice(action.index, 1);
    return state;
}

export function reducer(state: Entry<unknown>[], action: Action): Entry<unknown>[] {
    switch (action.type) {
        case ActionType.SET_KEY:
            return handleSetKey(state, action);
            
        case ActionType.SET_VALUE:
            return handleSetValue(state, action);

        case ActionType.PUSH_NEW:
            return handlePushNew(state);

        case ActionType.REMOVE:
            return handleRemove(state, action);

        default:
            return state;
    }
}
