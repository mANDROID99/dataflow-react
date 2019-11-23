import React from 'react';
import { MenuItem } from './MenuDropdown';
import MenuDropdownItem from './MenuDropdownItem';

type Props = {
    label: string;
    items: MenuItem[];
    onItemSelected: (key: string) => void;
}

function MenuDropdownGroup(props: Props): React.ReactElement {
    return (
        <div className="graph-menu-dropdown-group">
            <div className="graph-menu-dropdown-group-label">{ props.label }</div>
            {props.items.map((item, index) => (
                <MenuDropdownItem
                    key={index}
                    item={item}
                    onItemSelected={props.onItemSelected}
                />
            ))}
        </div>
    );
}

export default React.memo(MenuDropdownGroup);
