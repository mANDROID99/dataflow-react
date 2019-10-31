import * as d3 from "d3";

import { Graph, GraphNode, GraphNodePort } from "../../types/graphTypes";
import { GraphSpec } from "../../types/graphSpecTypes";
import { getPortX, getPortY } from "./measure";

type Connection = {
    start: GraphNodePort;
    end: GraphNodePort;
    sx: number;
    sy: number;
    ex: number;
    ey: number;
}

function selectConnectionKey(datum: Connection): string {
    const start = datum.start;
    const end = datum.end;
    return [start.node, start.port, end.node, end.port].join('__');
}

export function pathFromTo(sx: number, sy: number, ex: number, ey: number) {
    return `M${sx},${sy}L${ex},${ey}`
}

function getGraphConnections(graph: Graph, spec: GraphSpec): Connection[] {
    const connections: Connection[] = [];
    for (let [nodeName, node] of Object.entries(graph.nodes)) {
        const nodeSpec = spec.nodes[node.type];
        if (nodeSpec == null) continue;

        const startX = node.x;
        const startY = node.y;
        const xOff = getPortX(nodeSpec, true);

        let i = 0;
        for (let portSpec of nodeSpec.ports.out) {
            const portName = portSpec.name;
            const portTarget = node.ports.out[portName];

            if (portTarget) {
                const yOff = getPortY(nodeSpec, true, i);

                const endNode = graph.nodes[portTarget.node];
                if (endNode == null) continue;

                const endNodeSpec = spec.nodes[endNode.type];
                if (endNodeSpec == null) continue;

                const j = endNodeSpec.ports.in.findIndex(p => p.name === portTarget.port);
                if (j < 0) continue;

                const endX = endNode.x + getPortX(endNodeSpec, false);
                const endY = endNode.y + getPortY(endNodeSpec, false, j);

                connections.push({
                    start: {
                        node: nodeName,
                        port: portName
                    },
                    end: portTarget,
                    sx: startX + xOff,
                    sy: startY + yOff,
                    ex: endX,
                    ey: endY
                });
            }
            i++;
        }
    }
    return connections;
}

export function createGraphConnectionsUpdater(svg: SVGSVGElement, spec: GraphSpec) {
    return (graph: Graph) => {
        const connections = getGraphConnections(graph, spec);

        d3.select(svg)
            .selectAll<SVGPathElement, Connection>('.graph-connection')
            .data(connections, selectConnectionKey)
            .join(enter => enter.append('path')
                .classed('graph-connection', true)
                .attr('data-start-node', c => c.start.node)
                .attr('data-start-port', c => c.start.port)
                .attr('data-end-node', c => c.end.node)
                .attr('data-end-port', c => c.end.port)
            )
            .attr('d', (conn) => pathFromTo(conn.sx, conn.sy, conn.ex, conn.ey));
    }
}

export function createDragConnectionsUpdater(svg: SVGSVGElement, spec: GraphSpec) {
    return (graph: Graph, node: GraphNode, dx: number, dy: number) => {
        const nodeSpec = spec.nodes[node.type];
        if (nodeSpec == null) return;
        
        const nodeName = node.id;
        const portsIn = node.ports.in;
        const portsOut = node.ports.out;

        const portsOutSpecs = nodeSpec.ports.out;
        const portsInSpecs = nodeSpec.ports.in;

        let i = 0;
        for (let portSpec of portsOutSpecs) {
            const portName = portSpec.name;
            const port = portsOut[portName];

            if (port) {
                const endNode = graph.nodes[port.node];
                if (endNode == null) continue;

                const endNodeSpec = spec.nodes[endNode.type];
                if (endNodeSpec == null) continue;

                const endPortIndex = endNodeSpec.ports.in.findIndex(p => p.name === port.port);
                if (endPortIndex < 0) continue;

                const sx = dx + getPortX(nodeSpec, true);
                const sy = dy + getPortY(nodeSpec, true, i);

                const ex = endNode.x + getPortX(endNodeSpec, false);
                const ey = endNode.y + getPortY(endNodeSpec, false, endPortIndex);

                const selector = `.graph-connection[data-start-node=${nodeName}][data-start-port=${portName}][data-end-node=${port.node}][data-end-port=${port.port}]`;
                d3.select(svg).selectAll(selector).attr('d', pathFromTo(sx, sy, ex, ey));
            }
            i++;
        }

        i = 0;
        for (let portSpec of portsInSpecs) {
            const portName = portSpec.name;
            const port = portsIn[portName];

            if (port) {
                const startNode = graph.nodes[port.node];
                if (startNode == null) continue;

                const startNodeSpec = spec.nodes[startNode.type];
                if (startNodeSpec == null) continue;

                const startPortIndex = startNodeSpec.ports.out.findIndex(p => p.name === port.port);
                if (startPortIndex < 0) continue;

                const sx = startNode.x + getPortX(startNodeSpec, true);
                const sy = startNode.y + getPortY(startNodeSpec, true, startPortIndex);

                const ex = dx + getPortX(nodeSpec, false);
                const ey = dy + getPortY(nodeSpec, false, i);

                const selector = `.graph-connection[data-start-node=${port.node}][data-start-port=${port.port}][data-end-node=${nodeName}][data-end-port=${portName}]`;
                d3.select(svg).selectAll(selector).attr('d', pathFromTo(sx, sy, ex, ey));
            }
            i++;
        }
    }
}
