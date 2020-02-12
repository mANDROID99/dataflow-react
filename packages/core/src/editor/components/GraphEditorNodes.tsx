import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { GraphConfig } from "../../types/graphConfigTypes";

import { selectGraphNodes, selectScrollX, selectScrollY } from "../../store/selectors";
import { computeContexts } from "../../processor/computeContexts";
import GraphNodeComponent from './graphnode/GraphNode';
import { useGraphContext } from "../graphEditorContext";
import { StoreState } from "../../types/storeTypes";

type Props<Ctx, P> = {
    graphConfig: GraphConfig<Ctx, P>;
}

function GraphEditorNodes<Ctx, P>({ graphConfig }: Props<Ctx, P>) {
    const graphNodes = useSelector(selectGraphNodes);
    const { params } = useGraphContext<Ctx, P>();

    // compute the context for all nodes in the graph
    const nodeContexts = useMemo(() => computeContexts(params, graphNodes, graphConfig), [params, graphNodes, graphConfig]);

    // select scroll offset from the store
    const { scrollX, scrollY } = useSelector((state: StoreState) => ({
        scrollX: selectScrollX(state),
        scrollY: selectScrollY(state)
    }), shallowEqual);

    return (
        <div id="nodes-container" className="ngraph-nodes" style={{ left: scrollX, top: scrollY }}>
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
