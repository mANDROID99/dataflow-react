import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItem } from './MenuDropdown';

type Props = {
    item: MenuItem;
    onItemSelected: (key: string) => void;
}

function MenuDropdownItem(props: Props): React.ReactElement {
    const item = props.item;
    return (
        <div className="graph-menu-dropdown-item" onClick={props.onItemSelected.bind(null, item.value)}>
            <span className="graph-menu-dropdown-item-label">{ item.label }</span>
            <FontAwesomeIcon icon="plus"/>
        </div>
    );
}

export default MenuDropdownItem;
