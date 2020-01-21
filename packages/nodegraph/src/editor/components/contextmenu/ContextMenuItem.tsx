import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    label: string;
    value: string;
    onItemSelected: (key: string) => void;
}

export default function ContextMenuItem(props: Props): React.ReactElement {
    const label = props.label;
    const value = props.value;

    return (
        <div className="ngraph-contextmenu-item" onClick={props.onItemSelected.bind(null, value)}>
            <span className="ngraph-contextmenu-item-label">{ label }</span>
            <FontAwesomeIcon className="ngraph-contextmenu-item-icon" icon="plus"/>
        </div>
    );
}
