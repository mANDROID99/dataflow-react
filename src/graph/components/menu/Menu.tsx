import React, { useState, useCallback, useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useDispatch } from 'react-redux';

import MenuDropdown, { MenuItemGroup, MenuItem } from './MenuDropdown';
import { graphContext } from '../Graph';
import { GraphSpec } from '../../types/graphSpecTypes';
import { createGraphNodeFromSpec } from '../../helpers/graphNodeFactory';
import { createNode } from '../../graphActions';
library.add(faPlus);

function sortBy<T>(key: keyof T) {
    return (left: T, right: T): number => {
        return (left[key] as unknown as number) - (right[key] as unknown as number);
    };
}

function resolveMenuItems(spec: GraphSpec): MenuItemGroup[] {
    const itemsByCategory = new Map<string, MenuItem[]>();

    let i = 0;
    for (const [nodeId, node] of Object.entries(spec.nodes)) {
        if (node) {
            const category = node.category;
            let items = itemsByCategory.get(category);
            if (!items) {
                items = [];
                itemsByCategory.set(category, items);
            }

            items.push({
                label: node.title,
                value: nodeId,
                order: node.menuOrder ?? i++
            });
        }
    }

    i = 0;
    const groups: MenuItemGroup[] = [];
    for (const [categoryId, category] of Object.entries(spec.categories)) {
        if (category) {
            const items = itemsByCategory.get(categoryId);
            if (items) {
                items.sort(sortBy('order'));
                groups.push({
                    label: category.label,
                    items,
                    order: category.menuOrder ?? i++
                });
            }
        }
    }

    return groups.sort(sortBy('order'));
}

export default function Menu(): React.ReactElement {
    const [isShowDropdown, setShowDropdown] = useState(false);
    const { graphId, spec } = useContext(graphContext);
    const dispatch = useDispatch();

    const menuItems = useMemo(() => resolveMenuItems(spec), [spec]);
    
    const onShow = useCallback(() => {
        setShowDropdown(true);
    }, []);
    
    const onHide = useCallback(() => {
        setShowDropdown(false);
    }, []);
    
    const nodeSpecs = spec.nodes;
    const onItemSelected = useCallback((nodeType: string) => {
        setShowDropdown(false);
        const nodeSpec = nodeSpecs[nodeType];
        if (nodeSpec) {
            const graphNode = createGraphNodeFromSpec(nodeType, nodeSpec);
            dispatch(createNode(graphId, graphNode));
        }
    }, [graphId, dispatch, nodeSpecs]);

    return (
        <div className="graph-menu">
            <div className="graph-menu-item-wrap-dropdown">
                <div className="graph-menu-item" onClick={onShow}>
                    <div className="graph-menu-item-icon">
                        <FontAwesomeIcon icon="plus"/>
                    </div>
                    <span>Add Node</span>
                </div>
                <MenuDropdown show={isShowDropdown} items={menuItems} onItemSelected={onItemSelected} onHide={onHide}/>
            </div>
        </div>
    );
}
