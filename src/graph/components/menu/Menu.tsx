import React, { useState, useCallback, useContext, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import MenuDropdown, { MenuItem } from './MenuDropdown';
import { graphContext } from '../Graph';
import { GraphNodeSpec } from '../../types/graphSpecTypes';
import { useDispatch } from 'react-redux';
import { createGraphNodeFromSpec } from '../../helpers/graphNodeFactory';
import { createNode } from '../../graphActions';
library.add(faPlus);

function resolveMenuItems(nodeSpecs: { [type: string]: GraphNodeSpec | undefined }): MenuItem[] {
    return Object.entries(nodeSpecs).map(([nodeType, nodeSpec]): MenuItem => ({
        label: nodeSpec!.menu.label,
        value: nodeType,
        group: nodeSpec!.menu.group
    }));
}

export default function Menu(): React.ReactElement {
    const [isShowDropdown, setShowDropdown] = useState(false);
    const { graphId, spec } = useContext(graphContext);
    const dispatch = useDispatch();

    const nodeSpecs = spec.nodes;
    const menuItems = useMemo(() => resolveMenuItems(nodeSpecs), [nodeSpecs]);

    const onShow = useCallback(() => {
        setShowDropdown(true);
    }, []);

    const onHide = useCallback(() => {
        setShowDropdown(false);
    }, []);

    const onItemSelected = useCallback((nodeType: string) => {
        setShowDropdown(false);
        const nodeSpec = nodeSpecs[nodeType];
        if (nodeSpec) {
            const graphNode = createGraphNodeFromSpec(nodeType, nodeSpec);
            dispatch(createNode(graphId, graphNode));
        }
    }, [graphId, dispatch, nodeSpecs]);

    return (
        <div className="flex absolute top-0 left-0 ml-2 mt-2">
            <div className="relative">
                <div className="border border-grey rounded hover:border-alt flex text-light cursor-pointer p-2" onClick={onShow}>
                    <div className="mr-2">
                        <FontAwesomeIcon icon="plus"/>
                    </div>
                    <span>Add Node</span>
                </div>
                <MenuDropdown show={isShowDropdown} items={menuItems} onItemSelected={onItemSelected} onHide={onHide}/>
            </div>
        </div>
    );
}
