import React from 'react';
import { InputProps } from "../types/graphInputTypes";

export type Action = {
    label: string;
    key: string;
    variant?: string;
}

export default function ActionsFieldInput({ actions, params }: InputProps<null>) {

    const handleClick = (key: string) => {
        actions.triggerEvent(key, null);
    };

    const actionButtons = (params.actions as Action[] | undefined);

    return (
        <div className="ngraph-actions-list">
            {actionButtons && actionButtons.map((action, index) => (
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

