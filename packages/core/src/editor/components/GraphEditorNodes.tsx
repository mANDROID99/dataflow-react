import React from "react";
import { useSelector } from "react-redux";

import { GraphConfig } from "../../types/graphConfigTypes";

import { selectGraph } from "../../store/selectors";
import { computeGraphNodes } from "../../processor/computeGraphNodes";
import GraphNodeComponent from './graphnode/GraphNode';

type Props<Ctx, P> = {
    graphConfig: GraphConfig<Ctx, P>;
    params?: P;
}

function GraphEditorNodes<Ctx, P>(props: Props<Ctx, P>) {
     // select graph-nodes from the store
     const graph = useSelector(selectGraph);

    // compute the context for all nodes in the graph
    const computedNodes = computeGraphNodes(graph, props.graphConfig, props.params);

    return (
        <div className="ngraph-nodes">
            {Object.keys(graph.nodes).map(nodeId => {
                const nodeComputed = computedNodes.get(nodeId);

                if (!nodeComputed) {
                    throw new Error('No node-context computed for node - ' + nodeId);
                }
                
                return (
                    <GraphNodeComponent
                        key={nodeId}
                        nodeId={nodeId}
                        nodeComputed={nodeComputed}
                        graphNode={graph.nodes[nodeId]}
                    />
                );
            })}
        </div>
    );
}

export default GraphEditorNodes;
