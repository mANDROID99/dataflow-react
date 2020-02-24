import React, { useRef } from 'react';
import GraphNodeConnections from './GraphConnections';
import GraphDragConnection from './GraphDragConnection';

type Props = {
    scrollX: number;
    scrollY: number;
    parent?: string;
}

function GraphConnectionsContainer({ scrollX, scrollY, parent }: Props): React.ReactElement {
    const container = useRef<SVGGElement>(null);
    const transform = `translate(${scrollX},${scrollY})`;
    return (
        <svg className="ngraph-graph-connections">
            <g ref={container} transform={transform}>
                <GraphDragConnection parent={parent} container={container}/>
                <GraphNodeConnections parent={parent}/>
            </g>
        </svg>
    );
}

export default GraphConnectionsContainer;
