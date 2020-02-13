import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { GraphNode } from '../../../types/graphTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import GraphNodeDragHandle, { DragWidthState } from './GraphNodeDragHandle';
import { setNodePos, setNodeCollapsed } from '../../../store/actions';

export type DragPosState = {
    x: number;
    y: number;
}

type Props = {
    nodeId: string;
    graphNode: GraphNode;
    graphNodeConfig: GraphNodeConfig<any, any>;
    onDrag: (state: DragPosState | undefined) => void;
    onDragWidth: (state: DragWidthState | undefined) => void;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    startPosX: number;
    startPosY: number;
    x: number;
    y: number;
}

function GraphNodeHeader(props: Props) {
    const { nodeId, graphNode, graphNodeConfig, onDrag, onDragWidth } = props;
    const dispatch = useDispatch();

    // setup drag behaviour
    const startDrag = useDrag<DragState>({
        onStart(event) {
            return {
                startMouseX: event.clientX,
                startMouseY: event.clientY,
                startPosX: graphNode.x,
                startPosY: graphNode.y,
                x: graphNode.x,
                y: graphNode.y
            };
        },
        onDrag(event, state) {
            const x = state.startPosX + (event.clientX - state.startMouseX);
            const y = state.startPosY + (event.clientY - state.startMouseY);

            state.x = x;
            state.y = y;

            onDrag({ x, y });
        },
        onEnd(event, state) {
            dispatch(setNodePos(nodeId, state.x, state.y));
        }
    });

    const handleMouseDownHeader = (event: React.MouseEvent) => {
        if (event.button === 0) {
            startDrag(event.nativeEvent);
        }
    };

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setNodeCollapsed(nodeId, !graphNode.collapsed));
    };

    return (
        <div onMouseDown={handleMouseDownHeader} className="ngraph-node-header">
            <div className="ngraph-node-header-icon" onMouseDown={handleMinimize}>
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
                onDrag={onDragWidth}
            />
        </div>
    );
}

export default React.memo(GraphNodeHeader);
