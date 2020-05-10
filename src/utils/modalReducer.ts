import { useReducer, Reducer } from "react";

export enum ActionType {
    SHOW,
    HIDE,
    EXIT
}

export type State<T> = {
    value?: T;
    show: boolean;
    exit: boolean;
}

export type Action<T> =
    | { type: ActionType.SHOW; value: T }
    | { type: ActionType.HIDE }
    | { type: ActionType.EXIT }
    ;

export function modalReducer<T>(state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
        case ActionType.SHOW:
            return { value: action.value, show: true, exit: false };
        case ActionType.HIDE:
            return { value: state.value, show: false, exit: false };
        case ActionType.EXIT:
            return { show: false, exit: true };
        default:
            return state;
    }
}

export function useModalReducer<T>() {
    return useReducer<Reducer<State<T>, Action<T>>>(modalReducer, { show: false, exit: true });
}
