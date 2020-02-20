import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig, DragType } from '../../../types/graphConfigTypes';
import { GraphNode } from '../../../types/graphTypes';

import GraphNodeDragHandle from './GraphNodeDragHandle';
import { setNodeCollapsed } from '../../../store/actions';

type Props = {
    nodeId: string;
    node: GraphNode;
    nodeConfig: GraphNodeConfig<any, any>;
    onDrag: (event: React.MouseEvent, type: DragType) => void;
}

function GraphNodeHeader({ nodeId, node, nodeConfig, onDrag }: Props) {
    const dispatch = useDispatch();

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setNodeCollapsed(nodeId, !node.collapsed));
    };

    const handleDragPos = (e: React.MouseEvent) => {
        onDrag(e, DragType.DRAG_POS);
    };

    return (
        <div className="ngraph-node-header">
            <div className="ngraph-node-header-icon" onClick={handleMinimize}>
                <FontAwesomeIcon icon={node.collapsed ? "plus" : "minus"}/>
            </div>
            <div className="ngraph-node-title ngraph-text-ellipsis" onMouseDown={handleDragPos}>
                {node.name ?? nodeConfig.title}
            </div>
            <GraphNodeDragHandle
                nodeWidth={node.width}
                nodeConfig={nodeConfig}
                onDrag={onDrag}
            />
        </div>
    );
}

export default React.memo(GraphNodeHeader);
