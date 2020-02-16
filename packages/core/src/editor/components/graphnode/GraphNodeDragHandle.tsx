import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import { getNodeMinWidth, getNodeMaxWidth } from '../../../utils/graph/graphNodeFactory';
import { setNodeWidth, setNodeDragging } from '../../../store/actions';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';

type Props = {
    nodeId: string;
    graphNodeWidth: number;
    graphNodeConfig: GraphNodeConfig<any, any>;
}

type DragState = {
    startX: number;
    startWidth: number;
    width: number;
}

function GraphNodeDragHandle(props: Props) {
    const { nodeId, graphNodeWidth, graphNodeConfig } = props;
    const ref = useRef<HTMLDivElement>(null);
    const minWidth = getNodeMinWidth(graphNodeConfig);
    const maxWidth = getNodeMaxWidth(graphNodeConfig);
    const dispatch = useDispatch();

    useDrag<DragState>(ref, {
        onStart(event) {
            dispatch(setNodeDragging(nodeId, true));
            return {
                startX: event.clientX,
                startWidth: graphNodeWidth,
                width: graphNodeWidth
            };
        },
        onDrag(event, state) {
            let w = state.startWidth + (event.clientX - state.startX);

            if (w < minWidth) {
                w = minWidth;
            }

            if (w > maxWidth) {
                w = maxWidth;
            }

            dispatch(setNodeWidth(nodeId, w));
        },
        onEnd() {
            dispatch(setNodeDragging(nodeId, false));
        }
    });

    return (
        <div ref={ref} className="ngraph-node-header-icon ngraph-node-drag-handle">
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
    );
}

export default React.memo(GraphNodeDragHandle);
