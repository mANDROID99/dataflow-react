import React from 'react';

type Props = {
    variant?: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactChild | React.ReactChild[];
}

function Button(props: Props) {
    let className = 'ngraph-btn';

    if (props.variant) {
        className += ' ' + props.variant;
    }

    return (
        <button
            className={className}
            disabled={props.disabled}
            onClick={props.onClick}
        >{props.children}</button>
    );
}

export default Button;
