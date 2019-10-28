import React, { useMemo, useReducer } from 'react';
import { Graph as GraphT, GraphSpec, GraphActions } from '../graphTypes';
import { GraphContext, Context } from '../graphContext';
import GraphNode from './GraphNode';
import { reducer, init } from '../graphStateReducer';
import GraphSVG from './GraphSVG';

type Props = {
    spec: GraphSpec;
    graph: GraphT;
    actions: GraphActions;
}

export default function Graph(props: Props) {
    const { spec, graph, actions } = props;
    const [state, dispatch] = useReducer(reducer, null, init);

    const nodes = graph.nodes;
    // const nodesState = state.nodes;

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
                    {Object.keys(nodes).map(nodeId => (
                        <GraphNode
                            key={nodeId}
                            nodeId={nodeId}
                            node={nodes[nodeId]}
                        />
                    ))}
                </div>
                <GraphSVG graph={graph}/>
            </div>
        </Context.Provider>
    );
}
