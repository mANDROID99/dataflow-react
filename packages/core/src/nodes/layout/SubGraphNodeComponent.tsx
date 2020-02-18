import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeComponentProps } from "../../types/graphConfigTypes";

export default function SubGraphNodeComponent({ node, nodeConfig, handleDragPos, actions }: GraphNodeComponentProps<any, any>) {

    const handleToggleCollaped = () => {
        actions.setCollapsed(!node.collapsed);
    };

    return (
        <div className="ngraph-node-body">
            <div className="ngraph-node-header" onMouseDown={handleDragPos}>
                <div className="ngraph-node-header-icon" onClick={handleToggleCollaped}>
                    <FontAwesomeIcon icon={node.collapsed ? "folder" : "folder-open"}/>
                </div>
                <div className="ngraph-node-title ngraph-text-ellipsis">
                    {node.name ?? nodeConfig.title}
                </div>
            </div>
            {!node.collapsed && (
                <div className="ngraph-subgraph-container" style={{ width: node.width, height: 300 }}>
                    
                </div>
            )}
        </div>
    );
}
