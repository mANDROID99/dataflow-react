import React, { useRef } from 'react';
import GraphNodeConnections from './GraphConnections';
import GraphDragConnection from './GraphDragConnection';

type Props = {
    scrollX: number;
    scrollY: number;
}

function GraphConnectionsContainer({ scrollX, scrollY }: Props): React.ReactElement {
    const containerRef = useRef<SVGSVGElement>(null);
    const transform = `translate(${scrollX},${scrollY})`;

    return (
        <svg className="ngraph-graph-connections">
            <g ref={containerRef} transform={transform}>
                <GraphDragConnection containerRef={containerRef}/>
                <GraphNodeConnections/>
            </g>
        </svg>
    );
}

export default GraphConnectionsContainer;
