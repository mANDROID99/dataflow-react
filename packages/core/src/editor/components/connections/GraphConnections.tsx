import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { GraphNode } from '../../../types/graphTypes';

import { selectSubGraphNodes } from '../../../store/selectors';
import GraphConnection from './GraphConnection';
import { PortId } from '../../GraphNodePortRefs';

type Connection = {
    key: string;
    start: PortId;
    end: PortId;
};

type Props = {
    parent?: string;
}

function getConnectionKey(startNode: string, startPort: string, endNode: string, endPort: string): string {
    return startNode + '__' + startPort + '__' + endNode + '__' + endPort;
}

function getConnections(nodes: { [key: string]: GraphNode }): Connection[] {
    const connections: Connection[] = [];

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

function GraphConnections({ parent }: Props) {
    const nodes = useSelector(useMemo(() => selectSubGraphNodes(parent), [parent]));
    const connections = getConnections(nodes);
    
    return (
        <>
            {connections.map(conn => {
                return <GraphConnection key={conn.key} startPort={conn.start} endPort={conn.end}/>;
            })}
        </>
    );
}

export default GraphConnections;
