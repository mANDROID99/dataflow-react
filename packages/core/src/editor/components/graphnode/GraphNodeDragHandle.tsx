import React, { useRef } from 'react';
import { useDispatch, batch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import { getNodeMinWidth, getNodeMaxWidth } from '../../../utils/graph/graphNodeFactory';
import { setNodeWidth } from '../../../store/actions';

import { DragWidthState } from './GraphNode';

type Props = {
    nodeId: string;
    nodeWidth: number;
    nodeConfig: GraphNodeConfig<any, any>;
    onDragWidthStateChanged: (state: DragWidthState | undefined) => void;
}

type DragState = {
    startX: number;
    nodeWidth: number;
    width: number;
}

function GraphNodeDragHandle({ nodeId, nodeWidth, nodeConfig, onDragWidthStateChanged }: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const minWidth = getNodeMinWidth(nodeConfig);
    const maxWidth = getNodeMaxWidth(nodeConfig);
    const dispatch = useDispatch();

    useDrag<DragState>(ref, {
        onStart(event) {
            return {
                startX: event.clientX,
                nodeWidth,
                width: nodeWidth
            };
        },
        onDrag(event, state) {
            let w = state.nodeWidth + (event.clientX - state.startX);

            if (w < minWidth) {
                w = minWidth;
            }

            if (w > maxWidth) {
                w = maxWidth;
            }

            state.width = w;
            onDragWidthStateChanged({ width: w });
        },
        onEnd(event, state) {
            if (state.width !== state.nodeWidth) {
                batch(() => {
                    onDragWidthStateChanged(undefined);
                    dispatch(setNodeWidth(nodeId, state.width));
                });
            }
        }
    });

    return (
        <div ref={ref} className="ngraph-node-header-icon ngraph-node-drag-handle">
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
    );
}

export default React.memo(GraphNodeDragHandle);
