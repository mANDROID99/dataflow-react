import React from 'react';
import { InputProps } from "../types/graphInputTypes";

export type Action = {
    label: string;
    key: string;
    variant?: string;
}

export default function ActionsFieldInput(props: InputProps<null>) {

    const handleClick = (key: string) => {
        props.callbacks.onEvent(key, null);
    };

    const actions = (props.params.actions as Action[] | undefined);

    return (
        <div className="ngraph-actions-list">
            {actions && actions.map((action, index) => (
                <button
                    key={index}
                    className={"ngraph-btn" + (action.variant ? ' ' + action.variant : '')}
                    onClick={handleClick.bind(null, action.key)}
                >
                    {action.label}
                </button>
            ))}
        </div>
    );
}

