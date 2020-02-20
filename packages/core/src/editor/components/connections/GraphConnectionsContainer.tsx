import React from 'react';
import GraphNodeConnections from './GraphConnections';
import GraphDragConnection from './GraphDragConnection';

type Props = {
    scrollX: number;
    scrollY: number;
    parent?: string;
}

function GraphConnectionsContainer({ scrollX, scrollY, parent }: Props): React.ReactElement {
    const transform = `translate(${scrollX},${scrollY})`;
    return (
        <svg className="ngraph-graph-connections">
            <g transform={transform}>
                <GraphDragConnection parent={parent}/>
                <GraphNodeConnections parent={parent}/>
            </g>
        </svg>
    );
}

export default GraphConnectionsContainer;
