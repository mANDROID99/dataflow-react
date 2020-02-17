import React, { useRef } from 'react';
import { useDispatch, batch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { GraphNode } from '../../../types/graphTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import GraphNodeDragHandle from './GraphNodeDragHandle';
import { setNodeCollapsed, setNodePos } from '../../../store/actions';
import { DragPosState, DragWidthState } from './GraphNode';

type Props = {
    nodeId: string;
    node: GraphNode;
    nodeConfig: GraphNodeConfig<any, any>;
    onDragPosStateChanged: (state: DragPosState | undefined) => void;
    onDragWidthStateChanged: (state: DragWidthState | undefined) => void;
}

type DragState = {
    startMouseX: number;
    startMouseY: number;
    nodeX: number;
    nodeY: number;
    x: number;
    y: number;
}

function GraphNodeHeader({ nodeId, node, nodeConfig, onDragPosStateChanged, onDragWidthStateChanged }: Props) {
    const dispatch = useDispatch();
    const headerRef = useRef<HTMLDivElement>(null);

    // setup drag behaviour
    useDrag<DragState>(headerRef, {
        onStart(event) {
            return {
                startMouseX: event.clientX,
                startMouseY: event.clientY,
                nodeX: node.x,
                nodeY: node.y,
                x: node.x,
                y: node.y
            };
        },
        onDrag(event, state) {
            state.x = state.nodeX + (event.clientX - state.startMouseX);
            state.y = state.nodeY + (event.clientY - state.startMouseY);
            onDragPosStateChanged({ x: state.x, y: state.y });
            
        },
        onEnd(event, state) {
            if (state.x !== state.nodeX || state.y !== state.nodeY) {
                batch(() => {
                    onDragPosStateChanged(undefined);
                    dispatch(setNodePos(nodeId, state.x, state.y));
                });
            }
        }
    });

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setNodeCollapsed(nodeId, !node.collapsed));
    };

    return (
        <div ref={headerRef} className="ngraph-node-header">
            <div className="ngraph-node-header-icon" onClick={handleMinimize}>
                <FontAwesomeIcon icon={node.collapsed ? "plus" : "minus"}/>
            </div>
            <div className="ngraph-node-title">
                <div className="ngraph-text-ellipsis">
                    {node.name ?? nodeConfig.title}
                </div>
            </div>
            <GraphNodeDragHandle
                nodeId={nodeId}
                nodeWidth={node.width}
                nodeConfig={nodeConfig}
                onDragWidthStateChanged={onDragWidthStateChanged}
            />
        </div>
    );
}

export default React.memo(GraphNodeHeader);
