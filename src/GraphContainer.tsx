import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StoreState } from './store/storeTypes';
import { GraphActions } from './graph/graphContext';
import { GraphNode } from './graph/types/graphTypes';
import { GraphSpec } from './graph/types/graphSpecTypes';

import {
    createNode,
    updateNode,
    removeNode
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
            onNodeCreated(nodeId: string, node: GraphNode) {
                dispatch(createNode(graphId, nodeId, node));
            },
            onNodeChanged(nodeId: string, node: GraphNode) {
                dispatch(updateNode(graphId, nodeId, node));
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

