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
        <div className="mb-1">
            <div className="text-primary p-1 pointer-events-none font-bold text-center">{ props.label }</div>
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
