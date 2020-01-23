import React from "react";
import { useSelector } from "react-redux";

import { GraphConfig } from "../../types/graphConfigTypes";

import { selectGraphNodes } from "../../store/selectors";
import { computeGraphNodeContexts } from "../../processor/computeGraphNodeContexts";
import GraphNodeComponent from './graphnode/GraphNode';

type Props<Ctx, P> = {
    graphConfig: GraphConfig<Ctx, P>;
    params?: P;
}

function GraphEditorNodes<Ctx, P>(props: Props<Ctx, P>) {
     // select graph-nodes from the store
     const graphNodes = useSelector(selectGraphNodes);

    // compute the context for all nodes in the graph
    const nodeContexts = computeGraphNodeContexts(props.params, graphNodes, props.graphConfig);

    return (
        <div className="ngraph-nodes">
            {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => {
                const nodeContext = nodeContexts.get(nodeId);

                if (!nodeContext) {
                    throw new Error('No node-context computed for node - ' + nodeId);
                }
                
                return (
                    <GraphNodeComponent
                        key={nodeId}
                        nodeId={nodeId}
                        nodeContext={nodeContext}
                        graphNode={graphNodes![nodeId]}
                    />
                );
            })}
        </div>
    );
}

export default GraphEditorNodes;
