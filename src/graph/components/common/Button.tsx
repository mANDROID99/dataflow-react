import React from 'react';
import classNames from 'classnames';

type Props = {
    primary?: boolean;
    children: React.ReactChild | React.ReactChild[];
    onClick: () => void;
}

export default function Button({ primary, children, onClick }: Props): React.ReactElement {
    return (
        <button
            className={classNames("btn", { primary: !!primary })}
            onClick={onClick}>
            { children }
        </button>
    );
}
