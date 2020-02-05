import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeConfig } from '../../../types/graphConfigTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import { getNodeMinWidth, getNodeMaxWidth } from '../../../utils/graph/graphNodeFactory';
import { setNodeWidth } from '../../../store/actions';
import { useDispatch } from 'react-redux';

export type DragWidthState = {
    width: number;
}

type Props = {
    nodeId: string;
    graphNodeWidth: number;
    graphNodeConfig: GraphNodeConfig<any, any>;
    onDrag: (state: DragWidthState | undefined) => void;
}

type DragState = {
    startX: number;
    startWidth: number;
    width: number;
}

function GraphNodeDragHandle(props: Props) {
    const { nodeId, graphNodeWidth, graphNodeConfig, onDrag } = props;
    const minWidth = getNodeMinWidth(graphNodeConfig);
    const maxWidth = getNodeMaxWidth(graphNodeConfig);
    const dispatch = useDispatch();

    // setup drag behaviour
    const startDrag = useDrag<DragState>({
        onStart(event) {
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

            state.width = w;

            onDrag({ width: w });
        },
        onEnd(event, state) {
            dispatch(setNodeWidth(nodeId, state.width));
        }
    });

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button === 0) {
            event.preventDefault();
            event.stopPropagation();
            startDrag(event.nativeEvent);
        }
    };

    return (
        <div className="ngraph-node-header-icon ngraph-node-drag-handle" onMouseDown={handleMouseDown}>
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
    );
}

export default React.memo(GraphNodeDragHandle);
