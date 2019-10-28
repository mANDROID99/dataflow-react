import React, { useMemo } from 'react';
import Graph from './graph/components/Graph';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from './store/storeTypes';
import { GraphSpec, GraphActions } from './graph/graphTypes';
import {
    setNodePosition,
    removeNode,
    setNodeFieldValue,
    nodePortStartDrag,
    nodePortEndDrag
} from './store/graphActions';

/**
 * Connects the graph to the redux-store.
 * 
 * The graph is isolated from the store so that it can be developed as a library that works in any context.
 */

type Props = {
    graphId: string;
    spec: GraphSpec;
}

export default function GraphContainer({ graphId, spec }: Props) {
    const dispatch = useDispatch();
    const graph = useSelector((state: StoreState) => {
        return state.graph.graphs[graphId];
    });

    const actions = useMemo<GraphActions>(() => {
        return {
            onNodePosChanged(nodeId: string, x: number, y: number) {
                dispatch(setNodePosition(graphId, nodeId, x, y));
            },
            onNodeRemoved(nodeId: string) {
                dispatch(removeNode(graphId, nodeId));
            },
            onNodeFieldChanged(nodeId: string, fieldName: string, value: unknown) {
                dispatch(setNodeFieldValue(graphId, nodeId, fieldName, value));
            },
            onNodePortStartDrag(nodeId: string, portOut: boolean, portName: string) {
                dispatch(nodePortStartDrag(graphId, nodeId, portOut, portName));
            },
            onNodePortEndDrag(nodeId: string, portOut: boolean, portName: string) {
                dispatch(nodePortEndDrag(graphId, nodeId, portOut, portName));
            }
        }
    }, [graphId, dispatch]);

    return (
        <Graph
            graph={graph}
            spec={spec}
            actions={actions}
        />
    )
}

