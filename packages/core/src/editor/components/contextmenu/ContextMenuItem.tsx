import React from 'react';

type Props = {
    label: string;
    onSelected: () => void;
}

export default function ContextMenuItem({ label, onSelected }: Props): React.ReactElement {
    return (
        <div className="ngraph-contextmenu-item" onClick={onSelected}>
            <span className="ngraph-contextmenu-item-label">{ label }</span>
        </div>
    );
}
