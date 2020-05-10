import React, { useReducer, Reducer, useEffect, useCallback } from 'react';

export type TransitionComponentProps<V> = {
    value: V;
    show: boolean;
    onExit: () => void
}

type Props<V> = {
    value: V | undefined;
    component: React.ComponentType<TransitionComponentProps<V>>;
}

type State<V> = {
    value: V | undefined;
    show: boolean;
    exited: boolean;
}

enum ActionType {
    SET_VALUE,
    EXIT
}

type Action<V> = 
    | { type: ActionType.SET_VALUE, value: V | undefined }
    | { type: ActionType.EXIT };

function init<V>(value: V | undefined): State<V> {
    const show = value !== undefined;
    return { value, show, exited: !show };
}

function reducer<V>(state: State<V>, action: Action<V>): State<V> {
    switch (action.type) {
        case ActionType.SET_VALUE: {
            const value = action.value;
            if (state.value === value) {
                return state;

            } else if (value !== undefined) {
                return { value, show: true, exited: false };

            } else {
                return { ...state, show: false };
            }
        }
        case ActionType.EXIT: {
            if (state.show) {
                return state;
            }
            return { value: undefined, show: false, exited: true };
        }
    }
}

export default function Transition<V>(props: Props<V>) {
    const [state, dispatch] = useReducer<Reducer<State<V>, Action<V>>, V | undefined>(reducer, props.value, init);
    
    useEffect(() => {
        dispatch({ type: ActionType.SET_VALUE, value: props.value });
    }, [props.value]);

    const handleExit = useCallback(() => {
        dispatch({ type: ActionType.EXIT });
    }, []);

    if (state.exited) {
        return null;

    } else {
        return React.createElement(props.component, {
            show: state.show,
            value: state.value!,
            onExit: handleExit
        });
    }
}

export function withTransition<V>(component: React.ComponentType<TransitionComponentProps<V>>): React.ComponentType<{ value: V | undefined }> {
    return function TransitionHOC(props) {
        return <Transition value={props.value} component={component}/>;
    };
}
