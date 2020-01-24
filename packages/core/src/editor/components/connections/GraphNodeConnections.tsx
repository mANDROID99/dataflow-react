import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { Graph } from '../../../types/graphTypes';
import { StoreState } from '../../../types/storeTypes';

import { plot } from "./curveHelpers";
import { selectGraph } from '../../../store/selectors';
import GraphConnection from './GraphConnection';
import { PortId } from '../../GraphNodePortRefs';

type Connection = {
    key: string;
    start: PortId;
    end: PortId;
};


function getConnectionKey(startNode: string, startPort: string, endNode: string, endPort: string): string {
    return startNode + '__' + startPort + '__' + endNode + '__' + endPort;
}


function getConnections(graph: Graph): Connection[] {
    const connections: Connection[] = [];
    const nodes = graph.nodes;

    for (const nodeId in nodes) {
        const node = nodes[nodeId];

        const ports = node.ports.out;
        for (const portName in ports) {
            const portTargets = ports[portName];
            if (!portTargets) continue;

            const start: PortId = { nodeId, portName, portOut: true };
            
            for (const portTarget of portTargets) {
                const end: PortId = { nodeId: portTarget.node, portName: portTarget.port, portOut: false };
                const key = getConnectionKey(nodeId, portName, portTarget.node, portTarget.port);

                connections.push({
                    key,
                    start,
                    end
                });
            }
        }
    }

    return connections;
}

function GraphNodeConnections() {
    const graph = useSelector(selectGraph);
    const connections = getConnections(graph);
    
    return (
        <>
            {connections.map(conn => {
                return <GraphConnection key={conn.key} startPort={conn.start} endPort={conn.end}/>;
            })}
        </>
    );
}

export default React.memo(GraphNodeConnections);
