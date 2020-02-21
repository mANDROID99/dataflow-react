import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { createSubNodesSelector } from "../../store/selectors";
import { computeContexts } from "../../processor/computeContexts";
import GraphNodeContainer from './graphnode/GraphNodeContainer';
import { useGraphContext } from "../graphEditorContext";

type Props<Ctx, P> = {
    scrollX: number;
    scrollY: number;
    parent?: string;
}

function GraphEditorNodes<Ctx, P>({ parent, scrollX, scrollY }: Props<Ctx, P>) {
    const { params, graphConfig } = useGraphContext<Ctx, P>();
    
    // select state from the store
    const subNodes = useSelector(useMemo(() => createSubNodesSelector(parent), [parent]));

    // compute context for all nodes in the graph
    const nodeContexts = useMemo(() => computeContexts(params, subNodes, graphConfig), [params, subNodes, graphConfig]);

    return (
        <div id="graph-nodes-container" className="ngraph-nodes" style={{ left: scrollX, top: scrollY }}>
            {Object.keys(subNodes).map(nodeId => {
                const context = nodeContexts.get(nodeId);

                if (!context) {
                    throw new Error('No node-context computed for node - ' + nodeId);
                }
                
                return (
                    <GraphNodeContainer
                        key={nodeId}
                        nodeId={nodeId}
                        context={context}
                        node={subNodes[nodeId]}
                    />
                );
            })}
        </div>
    );
}

export default GraphEditorNodes;
