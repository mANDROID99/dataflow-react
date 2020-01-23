import React, { useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { StoreState } from '../../../types/storeTypes';

import GraphNodeConnections from './GraphNodeConnections';
import { plot, getPortPos } from './connectionHelpers';
import { selectPortDrag, selectPorts } from '../../../store/selectors';

function GraphConnections(): React.ReactElement {
    const { portDrag, ports } = useSelector((state: StoreState) => ({
        portDrag: selectPortDrag(state),
        ports: selectPorts(state)
    }), shallowEqual);

    const containerRef = useRef<SVGSVGElement>(null);

    function renderDragConnection(): React.ReactElement | undefined {
        if (portDrag) {
            const port = portDrag.port;
            const start = getPortPos(ports, port.nodeId, port.portName, port.portOut);
            if (!start) return;
        
            let x = portDrag.dragX;
            let y = portDrag.dragY;

            if (containerRef.current) {
                const bounds = containerRef.current.getBoundingClientRect();
                x -= bounds.left;
                y -= bounds.top;
            }

            const d = plot(start.x, start.y, x, y, port.portOut);
            return <path className="ngraph-graph-connection-drag" d={d}/>;
        }
    }

    return (
        <svg ref={containerRef} className="ngraph-graph-connections">
            <GraphNodeConnections/>
            {renderDragConnection()}
        </svg>
    );
}

export default React.memo(GraphConnections);
