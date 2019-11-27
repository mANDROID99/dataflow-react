import React, { useState, useCallback, useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import MenuDropdown, { MenuItemGroup } from './MenuDropdown';
import { graphContext } from '../GraphEditor';
import { GraphConfig } from '../../../types/graphConfigTypes';
import { createGraphNodeFromSpec } from '../../helpers/graphNodeFactory';
import { createNode } from '../../editorActions';

function resolveMenuItems(spec: GraphConfig): MenuItemGroup[] {
    const groupsByName = new Map<string, MenuItemGroup>();

    for (const [nodeId, node] of Object.entries(spec.nodes)) {
        if (!node) continue;

        const groupName = node.menuGroup;
        let group: MenuItemGroup | undefined = groupsByName.get(groupName);
        
        if (!group) {
            group = { items: [], label: groupName }
            groupsByName.set(groupName, group);
        }

        group.items.push({
            label: node.title,
            value: nodeId
        });
    }

    return Array.from(groupsByName.values());
}

export default function Menu(): React.ReactElement {
    const [isShowDropdown, setShowDropdown] = useState(false);
    const { graphId, graphSpec, ctx } = useContext(graphContext);
    const dispatch = useDispatch();

    const menuItems = useMemo(() => resolveMenuItems(graphSpec), [graphSpec]);
    
    const toggleDropdown = useCallback(() => {
        setShowDropdown(!isShowDropdown);
    }, [isShowDropdown]);

    const hideDropdown = useCallback(() => {
        setShowDropdown(false);
    }, []);
        
    const onItemSelected = useCallback((nodeType: string) => {
        setShowDropdown(false);
        const graphNode = createGraphNodeFromSpec(nodeType, graphSpec, ctx);
        dispatch(createNode(graphId, graphNode));
    }, [graphId, dispatch, graphSpec, ctx]);

    return (
        <div className="graph-menu">
            <div className="graph-menu-item-wrap-dropdown">
                <div className="graph-menu-item" onClick={toggleDropdown}>
                    <div className="graph-menu-item-icon">
                        <FontAwesomeIcon icon="plus"/>
                    </div>
                    <span>Add Node</span>
                </div>
                <MenuDropdown show={isShowDropdown} items={menuItems} onItemSelected={onItemSelected} onHide={hideDropdown}/>
            </div>
        </div>
    );
}
