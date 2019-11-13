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
        <div className="flex cursor-pointer px-2 py-1 items-center hover:text-white hover:bg-primary" onClick={props.onItemSelected.bind(null, item.value)}>
            <span className="mr-3 flex-grow">{ item.label }</span>
            <FontAwesomeIcon icon="plus"/>
        </div>
    );
}

export default MenuDropdownItem;
