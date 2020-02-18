import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { GraphNode } from '../../../types/graphTypes';

import GraphNodeDragHandle from './GraphNodeDragHandle';
import { setNodeCollapsed } from '../../../store/actions';

type Props = {
    nodeId: string;
    node: GraphNode;
    nodeConfig: GraphNodeConfig<any, any>;
    onDragPos: (event: React.MouseEvent) => void;
    onDragWidth?: (event: React.MouseEvent) => void;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    nodeX: number;
    nodeY: number;
    x: number;
    y: number;
}

function GraphNodeHeader({ nodeId, node, nodeConfig, onDragPos, onDragWidth }: Props) {
    const dispatch = useDispatch();

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setNodeCollapsed(nodeId, !node.collapsed));
    };

    return (
        <div className="ngraph-node-header">
            <div className="ngraph-node-header-icon" onClick={handleMinimize}>
                <FontAwesomeIcon icon={node.collapsed ? "plus" : "minus"}/>
            </div>
            <div className="ngraph-node-title ngraph-text-ellipsis" onMouseDown={onDragPos}>
                {node.name ?? nodeConfig.title}
            </div>
            {onDragWidth && (
                <GraphNodeDragHandle
                    nodeId={nodeId}
                    nodeWidth={node.width}
                    nodeConfig={nodeConfig}
                    onDragWidth={onDragWidth}
                />
            )}
        </div>
    );
}

export default React.memo(GraphNodeHeader);
