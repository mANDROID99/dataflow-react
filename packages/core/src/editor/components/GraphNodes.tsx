import React, { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import { createSubNodesSelector } from "../../store/selectors";
import GraphNode from './graphnode/GraphNode';

type Props = {
    scrollX: number;
    scrollY: number;
    parent?: string;
}

export default function GraphNodes({ parent, scrollX, scrollY }: Props) {
    const container = useRef<HTMLDivElement>(null);
    
    // select state from the store, filtered by sub-graph
    const subNodes = useSelector(useMemo(() => createSubNodesSelector(parent), [parent]));

    return (
        <div ref={container} className="ngraph-nodes" style={{ left: scrollX, top: scrollY }}>
            {Object.keys(subNodes).map(nodeId => {
                return (
                    <GraphNode
                        key={nodeId}
                        nodeId={nodeId}
                        node={subNodes[nodeId]}
                        container={container}
                    />
                );
            })}
        </div>
    );
}
