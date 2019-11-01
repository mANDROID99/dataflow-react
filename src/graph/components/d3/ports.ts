import * as d3 from 'd3';

import { GraphNode } from "../../types/graphTypes";
import { GraphSpec } from "../../types/graphSpecTypes";
import { GraphContext } from './types';
import { lookupPortX, lookupPortY, PORT_RADIUS, lookupPortRelativeX, lookupPortRelativeY, translate } from "./helpers";
import { pathFromTo } from './connections';

type PortDatum = {
    node: string;
    port: string;
    portOut: boolean;
    index: number;
}

function toPortData(spec: GraphSpec, node: GraphNode, portOut: boolean): PortDatum[] {
    const nodeSpec = spec.nodes[node.type];
    const portSpecs = (portOut ? nodeSpec.ports.out : nodeSpec.ports.in);

    return portSpecs.map((port, index): PortDatum => {
        return {
            node: node.id,
            port: port.name,
            portOut,
            index
        };
    });
}

function updateDragConnection(context: GraphContext) {
    d3.select(context.container)
        .selectAll('.graph-connection.dragging')
        .data(context.portDrag ? [context.portDrag] : [])
        .join(enter => enter.append('path')
            .classed('graph-connection dragging', true)
        )
        .attr('d', d => pathFromTo(d.startX, d.startY, d.x, d.y));
}

function createPort(context: GraphContext) {
    return (g: d3.Selection<SVGGElement, PortDatum, any, any>) => {
        g.append('circle')
            .classed('graph-node-port', true)
            .attr('r', PORT_RADIUS)
            .call(d3.drag<SVGCircleElement, PortDatum>()
                .container(context.container)
                .on('start', function(datum) {
                    const x = lookupPortX(context, datum.node, datum.portOut);
                    const y = lookupPortY(context, datum.node, datum.portOut, datum.index);
                    context.portDrag = { startX: x, startY: y, x, y };
                })
                .on('drag', function(p) {
                    const d = context.portDrag;
                    if (d == null) return;

                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    updateDragConnection(context);
                })
                .on('end', function(p) {
                    context.portDrag = undefined;
                    updateDragConnection(context);
                })
            );
    }
}

export function updateNodePortsOut(context: GraphContext) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.out')
            .data(n => toPortData(context.spec, n, true))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container out', true)
                .attr('transform', (datum) => {
                    const x = lookupPortRelativeX(context, datum.node, true);
                    const y = lookupPortRelativeY(context, datum.node, true, datum.index);
                    return translate(x, y);
                })
                .call(createPort(context))
            );
    }
}

export function updateNodePortsIn(context: GraphContext) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.in')
            .data(n => toPortData(context.spec, n, false))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container in', false)
                .attr('transform', (datum) => {
                    const x = lookupPortRelativeX(context, datum.node, false);
                    const y = lookupPortRelativeY(context, datum.node, false, datum.index);
                    return translate(x, y);
                })
                .call(createPort(context))
            );
    }
}
