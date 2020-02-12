import React, { useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import GraphNodeConnections from './GraphConnections';
import GraphDragConnection from './GraphDragConnection';
import { StoreState } from '../../../types/storeTypes';
import { selectScrollX, selectScrollY } from '../../../store/selectors';

function GraphConnectionsContainer(): React.ReactElement {
    const containerRef = useRef<SVGSVGElement>(null);

    // select scroll offset from the store
    const { scrollX, scrollY } = useSelector((state: StoreState) => ({
        scrollX: selectScrollX(state),
        scrollY: selectScrollY(state)
    }), shallowEqual);

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
