import * as d3 from "d3";

import { GraphNode, GraphNodePort } from "../../types/graphTypes";
import { GraphContext } from "./types";
import { lookupPortX, lookupPortY, lookupPortRelativeX, lookupPortRelativeY } from "./helpers";

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

function getGraphConnections(context: GraphContext): Connection[] {
    const graph = context.graph;
    const spec = context.spec;
    const connections: Connection[] = [];

    for (let [nodeName, node] of Object.entries(graph.nodes)) {
        const nodeSpec = spec.nodes[node.type];
        if (nodeSpec == null) continue;

        let i = 0;
        for (let portSpec of nodeSpec.ports.out) {
            const portName = portSpec.name;
            const port = node.ports.out[portName];

            if (port) {
                const endNode = graph.nodes[port.node];
                if (endNode == null) continue;

                const endNodeSpec = spec.nodes[endNode.type];
                if (endNodeSpec == null) continue;

                const j = endNodeSpec.ports.in.findIndex(p => p.name === port.port);
                if (j < 0) continue;

                const sx = lookupPortX(context, nodeName, true);
                const sy = lookupPortY(context, nodeName, true, i);

                const ex = lookupPortX(context, port.node, false);
                const ey = lookupPortY(context, port.node, false, j);

                connections.push({
                    start: {
                        node: nodeName,
                        port: portName
                    },
                    end: port,
                    sx, sy, ex, ey
                });
            }
            i++;
        }
    }
    return connections;
}

export function updateGraphConnections(context: GraphContext) {
    const connections = getGraphConnections(context);

    d3.select(context.container)
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

export function updateDragConnections(context: GraphContext, node: GraphNode, dx: number, dy: number) {
    const spec = context.spec;
    const graph = context.graph;
    const container = context.container;

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

            const sx = dx + lookupPortRelativeX(context, nodeName, true);
            const sy = dy + lookupPortRelativeY(context, nodeName, true, i);

            const ex = lookupPortX(context, port.node, false);
            const ey = lookupPortY(context, port.node, false, endPortIndex);

            const selector = `.graph-connection[data-start-node=${nodeName}][data-start-port=${portName}][data-end-node=${port.node}][data-end-port=${port.port}]`;
            d3.select(container).selectAll(selector).attr('d', pathFromTo(sx, sy, ex, ey));
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

            const sx = lookupPortX(context, port.node, true);
            const sy = lookupPortY(context, port.node, true, startPortIndex);

            const ex = dx + lookupPortRelativeX(context, nodeName, false);
            const ey = dy + lookupPortRelativeY(context, nodeName, false, i);

            const selector = `.graph-connection[data-start-node=${port.node}][data-start-port=${port.port}][data-end-node=${nodeName}][data-end-port=${portName}]`;
            d3.select(container).selectAll(selector).attr('d', pathFromTo(sx, sy, ex, ey));
        }
        i++;
    }
}
