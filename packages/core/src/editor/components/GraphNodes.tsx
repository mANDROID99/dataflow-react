import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { selectGraphNodeContexts, selectSubGraphNodes } from "../../store/selectors";
import { useGraphContext } from "../graphEditorContext";
import GraphNode from './graphnode/GraphNode';

type Props = {
    scrollX: number;
    scrollY: number;
    parent?: string;
}

export default function GraphNodes({ parent, scrollX, scrollY }: Props) {
    const container = useRef<HTMLDivElement>(null);
    const { graphConfig, params } = useGraphContext();
    
    // select state from the store, filtered by sub-graph
    const subNodes = useSelector(useMemo(() => selectSubGraphNodes(parent), [parent]));

    // select graph-node contexts
    const subNodeContexts = useSelector(useMemo(() => selectGraphNodeContexts(parent, graphConfig, params), [parent, graphConfig, params]));

    return (
        <div ref={container} className="ngraph-nodes" style={{ left: scrollX, top: scrollY }}>
            {Object.keys(subNodes).map(nodeId => {
                const nodeContext = subNodeContexts.get(nodeId);

                return (
                    <GraphNode
                        key={nodeId}
                        nodeId={nodeId}
                        node={subNodes[nodeId]}
                        container={container}
                        nodeContext={nodeContext}
                    />
                );
            })}
        </div>
    );
}
