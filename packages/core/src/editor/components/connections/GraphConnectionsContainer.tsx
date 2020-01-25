import React, { useRef } from 'react';

import GraphNodeConnections from './GraphConnections';
import GraphDragConnection from './GraphDragConnection';

function GraphConnectionsContainer(): React.ReactElement {
    const containerRef = useRef<SVGSVGElement>(null);

    return (
        <svg ref={containerRef} className="ngraph-graph-connections">
            <GraphDragConnection containerRef={containerRef}/>
            <GraphNodeConnections/>
        </svg>
    );
}

export default GraphConnectionsContainer;
