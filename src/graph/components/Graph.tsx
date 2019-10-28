import React, { useMemo, useReducer, useEffect } from 'react';

import { Graph as GraphT } from '../types/graphTypes';
import { GraphSpec } from '../types/graphSpecTypes';
import { GraphContext, Context, GraphActions } from '../graphContext';

import { reducer, init } from '../graphStateReducer';
import GraphNode from './GraphNode';
import GraphSVG from './GraphSVG';
import { GraphActionType } from '../types/graphStateTypes';

type Props = {
    spec: GraphSpec;
    graph: GraphT;
    actions: GraphActions;
}

export default function Graph(props: Props) {
    const { spec, graph, actions } = props;
    const [state, dispatch] = useReducer(reducer, graph, init);

    const graphNodes = state.graph.nodes;
    const stateNodes = state.nodes;

    useEffect(() => {
        if (state.graph !== graph) {
            dispatch({ type: GraphActionType.INIT, graph });
        }
    }, [graph]);

    const graphContext = useMemo<GraphContext>(() => {
        return {
            spec,
            actions,
            dispatch
        };
    }, [spec, actions]);

    return (
        <Context.Provider value={graphContext}>
            <div className="graph-container">
                <div className="graph-nodes">
                    {Object.keys(stateNodes).map(nodeId => (
                        <GraphNode
                            key={nodeId}
                            nodeId={nodeId}
                            node={graphNodes[nodeId]}
                            nodeState={stateNodes[nodeId]}
                        />
                    ))}
                </div>
                <GraphSVG graph={graph}/>
            </div>
        </Context.Provider>
    );
}
