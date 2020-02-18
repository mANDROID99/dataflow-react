import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { GraphConfig } from "../../types/graphConfigTypes";
import { selectGraphNodes } from "../../store/selectors";
import { computeContexts } from "../../processor/computeContexts";
import GraphNodeContainer from './graphnode/GraphNodeContainer';
import { useGraphContext } from "../graphEditorContext";

type Props<Ctx, P> = {
    scrollX: number;
    scrollY: number;
    graphConfig: GraphConfig<Ctx, P>;
}

function GraphEditorNodes<Ctx, P>({ scrollX, scrollY, graphConfig }: Props<Ctx, P>) {
    const graphNodes = useSelector(selectGraphNodes);
    const { params } = useGraphContext<Ctx, P>();

    // compute the context for all nodes in the graph
    const nodeContexts = useMemo(() => computeContexts(params, graphNodes, graphConfig), [params, graphNodes, graphConfig]);

    return (
        <div id="nodes-container" className="ngraph-nodes" style={{ left: scrollX, top: scrollY }}>
            {(graphNodes ? Object.keys(graphNodes) : []).map(nodeId => {
                const context = nodeContexts.get(nodeId);

                if (!context) {
                    throw new Error('No node-context computed for node - ' + nodeId);
                }
                
                return (
                    <GraphNodeContainer
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
