import React from "react";
import { useSelector } from "react-redux";

import { GraphConfig } from "../../types/graphConfigTypes";

import { selectGraphNodes } from "../../store/selectors";
import { computeContexts } from "../../processor/computeContexts";
import GraphNodeComponent from './graphnode/GraphNode';
import { useGraphContext } from "../graphEditorContext";

type Props<Ctx, P> = {
    graphConfig: GraphConfig<Ctx, P>;
}

function GraphEditorNodes<Ctx, P>(props: Props<Ctx, P>) {
    // select graph-nodes from the store
    const graphNodes = useSelector(selectGraphNodes);
    const { params } = useGraphContext<Ctx, P>()

    // compute the context for all nodes in the graph
    const nodeContexts = computeContexts(params, graphNodes, props.graphConfig);

    return (
        <div className="ngraph-nodes">
            {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => {
                const context = nodeContexts.get(nodeId);

                if (!context) {
                    throw new Error('No node-context computed for node - ' + nodeId);
                }
                
                return (
                    <GraphNodeComponent
                        key={nodeId}
                        nodeId={nodeId}
                        context={context}
                        node={graphNodes[nodeId]}
                    />
                );
            })}
        </div>
    );
}

export default GraphEditorNodes;
