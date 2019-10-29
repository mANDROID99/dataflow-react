import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState } from './store/storeTypes';
import { GraphActions } from './graph/graphContext';
import { GraphSpec } from './graph/types/graphSpecTypes';

import {
    setNodePosition,
    setNodeFieldValue,
    removeNode,
    clearNodeConnection
} from './store/graphActions';
import Graph from './graph/components/Graph';

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

    const actions = useMemo<GraphActions>((): GraphActions => {
        return {
            onNodePosChanged(nodeId, x, y) {
                dispatch(setNodePosition(graphId, nodeId, x, y));
            },
            onNodeFieldValueChanged(nodeId, fieldName, value) {
                dispatch(setNodeFieldValue(graphId, nodeId, fieldName, value));
            },
            onNodeConnectionCleared(nodeId, portName, portOut) {
                dispatch(clearNodeConnection(graphId, nodeId, portName, portOut));
            },
            onNodeRemoved(nodeId: string) {
                dispatch(removeNode(graphId, nodeId));
            }
        }
    }, [graphId, dispatch]);

    return (
        <Graph
            graph={graph}
            spec={spec}
            actions={actions}
        />
    );
}

