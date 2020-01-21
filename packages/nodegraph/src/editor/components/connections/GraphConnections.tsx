import React, { useRef } from 'react';
import { Graph } from '../../../types/graphTypes';
import { PortStates, PortDragState } from '../../../types/graphReducerTypes';
import GraphNodeConnections from './GraphNodeConnections';
import { plot, getPortPos } from './connectionHelpers';

type Props = {
    graph: Graph;
    ports: PortStates;
    portDrag: PortDragState | undefined;
}


function GraphConnections(props: Props): React.ReactElement {
    const { graph, portDrag, ports } = props;
    const containerRef = useRef<SVGSVGElement>(null);

    function renderDragConnection(): React.ReactElement | undefined {
        if (portDrag) {
            const port = portDrag.port;
            const start = getPortPos(ports, port.nodeId, port.portId, port.portOut);
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
            <GraphNodeConnections graph={graph} ports={ports}/>
            {renderDragConnection()}
        </svg>
    );
}

export default React.memo(GraphConnections);
