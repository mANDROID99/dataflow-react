import React from 'react';
import { useDrag } from '../../../utils/hooks/useDrag';
import { GraphAction, GraphActionType } from '../../../types/graphReducerTypes';
import { GraphNodeConfig } from '../../../types/graphConfigTypes';
import GraphNodeDragHandle, { DragWidthState } from './GraphNodeDragHandle';

export type DragPosState = {
    x: number;
    y: number;
}

type Props = {
    nodeId: string;
    nodeX: number;
    nodeY: number;
    nodeWidth: number;
    nodeConfig: GraphNodeConfig<any, any>;
    dispatch: React.Dispatch<GraphAction>;
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
    const { nodeId, nodeX, nodeY, nodeWidth, nodeConfig, onDrag, onDragWidth, dispatch } = props;

    // setup drag behaviour
    const startDrag = useDrag<DragState>({
        onStart(event) {
            dispatch({ type: GraphActionType.SELECT_NODE, nodeId });

            return {
                startMouseX: event.clientX,
                startMouseY: event.clientY,
                startPosX: nodeX,
                startPosY: nodeY,
                x: nodeX,
                y: nodeY
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
            dispatch({
                type: GraphActionType.SET_NODE_POS,
                nodeId,
                x: state.x,
                y: state.y
            });
        }
    });


    const handleMouseDownHeader = (event: React.MouseEvent) => {
        if (event.button === 0) {
            event.stopPropagation();
            startDrag(event.nativeEvent);
        }
    };

    return (
        <div onMouseDown={handleMouseDownHeader} className="ngraph-node-header">
            <span className="ngraph-node-title">
                { nodeConfig.title }
            </span>
            <GraphNodeDragHandle
                dispatch={dispatch}
                nodeConfig={nodeConfig}
                nodeId={nodeId}
                nodeWidth={nodeWidth}
                onDrag={onDragWidth}
            />
        </div>
    );
}

export default React.memo(GraphNodeHeader);
