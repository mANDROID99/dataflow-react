import React from 'react';
import { useDrag } from '../../../utils/hooks/useDrag';
import { GraphAction, GraphActionType } from '../../../types/graphReducerTypes';
import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import { getNodeMinWidth, getNodeMaxWidth } from '../../../utils/graph/graphNodeFactory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type DragWidthState = {
    width: number;
}

type Props = {
    nodeId: string;
    nodeWidth: number;
    nodeConfig: GraphNodeConfig<any, any>;
    dispatch: React.Dispatch<GraphAction>;
    onDrag: (state: DragWidthState | undefined) => void;
}

type DragState = {
    startX: number;
    startWidth: number;
    width: number;
}

function GraphNodeDragHandle(props: Props) {
    const { nodeId, nodeWidth, nodeConfig, onDrag, dispatch } = props;
    const minWidth = getNodeMinWidth(nodeConfig);
    const maxWidth = getNodeMaxWidth(nodeConfig);

    // setup drag behaviour
    const startDrag = useDrag<DragState>({
        onStart(event) {
            return {
                startX: event.clientX,
                startWidth: nodeWidth,
                width: nodeWidth
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
            dispatch({
                type: GraphActionType.SET_NODE_WIDTH,
                nodeId,
                width: state.width
            });
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
        <div className="ngraph-node-drag-handle" onMouseDown={handleMouseDown}>
            <FontAwesomeIcon icon="arrows-alt-h"/>
        </div>
        // <svg className="ngraph-node-drag-handle" onMouseDown={handleMouseDown}>
        //     <path d="M0 0 L7 0 L7 7"/>
        // </svg>
    );
}

export default React.memo(GraphNodeDragHandle);
