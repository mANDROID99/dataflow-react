import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { GraphNode } from '../../../types/graphTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import GraphNodeDragHandle from './GraphNodeDragHandle';
import { setNodeCollapsed, setNodePos, setNodeDragging } from '../../../store/actions';

export type DragPosState = {
    x: number;
    y: number;
}

type Props = {
    nodeId: string;
    graphNode: GraphNode;
    graphNodeConfig: GraphNodeConfig<any, any>;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    nodeX: number;
    nodeY: number;
}

function GraphNodeHeader(props: Props) {
    const { nodeId, graphNode, graphNodeConfig } = props;
    const dispatch = useDispatch();
    const headerRef = useRef<HTMLDivElement>(null);

    // setup drag behaviour
    useDrag<DragState>(headerRef, {
        onStart(event) {
            dispatch(setNodeDragging(nodeId, true));
            return {
                startMouseX: event.clientX,
                startMouseY: event.clientY,
                nodeX: graphNode.x,
                nodeY: graphNode.y
            };
        },
        onDrag(event, state) {
            const x = state.nodeX + (event.clientX - state.startMouseX);
            const y = state.nodeY + (event.clientY - state.startMouseY);
            dispatch(setNodePos(nodeId, x, y));
        },
        onEnd() {
            dispatch(setNodeDragging(nodeId, false));
        }
    });

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setNodeCollapsed(nodeId, !graphNode.collapsed));
    };

    return (
        <div ref={headerRef} className="ngraph-node-header">
            <div className="ngraph-node-header-icon" onClick={handleMinimize}>
                <FontAwesomeIcon icon={graphNode.collapsed ? "plus" : "minus"}/>
            </div>
            <div className="ngraph-node-title">
                <div className="ngraph-text-ellipsis">
                    {graphNode.name ?? graphNodeConfig.title}
                </div>
            </div>
            <GraphNodeDragHandle
                nodeId={nodeId}
                graphNodeWidth={graphNode.width}
                graphNodeConfig={graphNodeConfig}
            />
        </div>
    );
}

export default React.memo(GraphNodeHeader);
