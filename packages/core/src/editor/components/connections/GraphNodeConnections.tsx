import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { Graph } from '../../../types/graphTypes';
import { PortStates, StoreState } from '../../../types/storeTypes';

import { plot, getPortPos } from "./connectionHelpers";
import { getConnectionKey } from '../../../utils/graph/portUtils';
import { selectGraph, selectPorts } from '../../../store/selectors';

type Connection = {
    key: string;
    sx: number;
    sy: number;
    ex: number;
    ey: number;
};

function getConnections(graph: Graph, portStates: PortStates): Connection[] {
    const connections: Connection[] = [];
    const nodes = graph.nodes;

    for (const nodeId of Object.keys(nodes)) {
        const node = nodes[nodeId];

        const ports = node.ports.out;
        for (const portId of Object.keys(ports)) {
            const portTargets = ports[portId];
            if (!portTargets) continue;

            const start = getPortPos(portStates, nodeId, portId, true);
            if (!start) continue;
            
            for (const portTarget of portTargets) {
                const end = getPortPos(portStates, portTarget.node, portTarget.port, false);
                if (!end) continue;

                const key = getConnectionKey(nodeId, portId, portTarget.node, portTarget.port);
                connections.push({
                    key,
                    sx: start.x,
                    sy: start.y,
                    ex: end.x,
                    ey: end.y
                });
            }
        }
    }

    return connections;
}

function GraphNodeConnections() {
    const { graph, ports } = useSelector((state: StoreState) => ({
        graph: selectGraph(state),
        ports: selectPorts(state)
    }), shallowEqual);

    const connections = getConnections(graph, ports);
    
    return (
        <>
            {connections.map(conn => {
                const d = plot(conn.sx, conn.sy, conn.ex, conn.ey, true);
                return <path key={conn.key} className="ngraph-graph-connection" d={d}/>;
            })}
        </>
    );
}

export default React.memo(GraphNodeConnections);
