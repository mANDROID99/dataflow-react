import React, { useState, useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import MenuDropdownGroup from './MenuDropdownGroup';

export type MenuItem = {
    label: string;
    value: string;
    group?: string;
}

type MenuItemGroup = {
    label: string;
    items: MenuItem[];
}

type Props = {
    show: boolean;
    items: MenuItem[];
    onHide: () => void;
    onItemSelected: (key: string) => void;
}

function groupItems(items: MenuItem[]): MenuItemGroup[] {
    const groups: Map<string, MenuItemGroup> = new Map<string, MenuItemGroup>();
    for (const item of items) {
        const groupKey = item.group || '';
        let group = groups.get(groupKey);
        if (group == null) {
            group = {
                label: groupKey,
                items: []
            };

            groups.set(groupKey, group);
        }

        group.items.push(item);
    }
    return Array.from(groups.values());
}

export default function MenuDropdown(props: Props): JSX.Element | null {
    const [hidden, setHidden] = useState(true);
    const show = props.show;
    const items = props.items;
    const itemGroups = useMemo(() => groupItems(items), [items]);

    const afterAnimation = useCallback(() => {
        if (!show) {
            setHidden(true);
        }
    }, [show]);

    useEffect(() => {
        if (show) {
            setHidden(false);
        }
    }, [show]);

    return (
        <div className="relative h-0 mt-2">
            { show ? <div className="overlay" onClick={props.onHide}/> : undefined }
            <div className={classNames("absolute bg-dark text-light border border-grey rounded fade-down min-w-full", { invisible: hidden, in: show })} onTransitionEnd={afterAnimation}>
                {itemGroups.map((group, index) => (
                    <MenuDropdownGroup
                        key={index}
                        label={group.label}
                        items={group.items}
                        onItemSelected={props.onItemSelected}
                    />
                ))}
            </div>
        </div>
    );
}
