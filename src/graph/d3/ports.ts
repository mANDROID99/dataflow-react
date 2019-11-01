import * as d3 from 'd3';

import { GraphNode } from "../types/graphTypes";
import { GraphContext } from '../types/graphD3types';
import { lookupPortX, lookupPortY, lookupPortRelativeX, lookupPortRelativeY, translate, PORT_RADIUS, PORT_OVERLAY_RADIUS } from "./helpers";
import { pathFromTo } from './connections';

type PortDatum = {
    node: string;
    port: string;
    portType: string;
    portOut: boolean;
    portIndex: number;
}

function selectPortKey(datum: PortDatum): string {
    return [datum.node, datum.port, datum.portOut].join('__');
}

function toPortData(context: GraphContext, portOut: boolean) {
    const spec = context.spec;
    return (node: GraphNode): PortDatum[] => {
        const nodeSpec = spec.nodes[node.type];
        const portSpecs = (portOut ? nodeSpec.ports.out : nodeSpec.ports.in);

        return portSpecs.map((port, index): PortDatum => {
            return {
                node: node.id,
                port: port.name,
                portType: port.type,
                portOut,
                portIndex: index
            };
        });
    }
}

function updateDragTargets(context: GraphContext) {
    const drag = context.portDrag;

    const overlay = d3.select(context.container)
        .selectAll<SVGGElement, PortDatum>('.graph-node-port-container')
        .selectAll<SVGCircleElement, PortDatum>('.graph-node-port-overlay')
        .data(d => {
            // filter matching ports
            return drag && drag.node !== d.node && drag.portOut !== d.portOut && drag.portType === d.portType ? [d] : [];
        }, selectPortKey);

    overlay.enter()
        .append('circle')
        .classed('graph-node-port-overlay', true)
        .attr('r', PORT_OVERLAY_RADIUS)
        .attr('fill-opacity', 0)
        .on('mouseover', (d) => {
            context.portDragTarget = {
                node: d.node,
                port: d.port,
                portOut: d.portOut,
                portIndex: d.portIndex
            };
            updateDragConnection(context);
        })
        .on('mouseout', (d) => {
            const t = context.portDragTarget;
            if (t && t.node === d.node && t.port === d.port && t.portOut === d.portOut) {
                context.portDragTarget = undefined;
                updateDragConnection(context);
            }
        })
        .transition()
            .duration(200)
            .attr('fill-opacity', 1)

    overlay.exit()
        .attr('fill-opacity', 1)
        .transition()
            .duration(200)
            .attr('fill-opacity', 0)
            .remove();
}


function updateDragConnection(context: GraphContext) {
    d3.select(context.container)
        .selectAll('.graph-connection-dragger')
        .data(context.portDrag ? [context.portDrag] : [])
        .join(enter => enter.append('path')
            .style('pointer-events', 'none')
            .classed('graph-connection-dragger', true)
        )
        .classed('connected', context.portDragTarget != null)
        .attr('d', d => {
            const tgt = context.portDragTarget;
            const x = tgt ? lookupPortX(context, tgt.node, tgt.portOut) : d.x;
            const y = tgt ? lookupPortY(context, tgt.node, tgt.portOut, tgt.portIndex) : d.y;
            return pathFromTo(d.startX, d.startY, x, y)
        });
}

function createPorts(context: GraphContext) {
    const actions = context.actions;
    return (enter: d3.Selection<SVGGElement, PortDatum, any, any>) => {
        enter.append('circle')
            .classed('graph-node-port', true)
            .attr('r', PORT_RADIUS)
            .call(d3.drag<SVGCircleElement, PortDatum>()
                .container(context.container)
                .on('start', function(datum) {
                    const x = lookupPortX(context, datum.node, datum.portOut);
                    const y = lookupPortY(context, datum.node, datum.portOut, datum.portIndex);

                    context.portDrag = {
                        node: datum.node,
                        port: datum.port,
                        portOut: datum.portOut,
                        portType: datum.portType,
                        startX: x,
                        startY: y,
                        x, y
                    };

                    updateDragTargets(context);

                    if (!datum.portOut) {
                        // clear existing connections when an "in" port is dragged
                        actions.clearPortConnections(datum.node, datum.port, false);
                    }
                })
                .on('drag', function(p) {
                    const d = context.portDrag;
                    if (d == null) return;

                    d.x += d3.event.dx;
                    d.y += d3.event.dy;
                    updateDragConnection(context);
                })
                .on('end', function(p) {
                    const drag = context.portDrag;
                    const target = context.portDragTarget;

                    context.portDrag = undefined;
                    context.portDragTarget = undefined;
                    updateDragConnection(context);
                    updateDragTargets(context);

                    if (target && drag) {
                        actions.addPortConnection(drag.node, drag.port, drag.portOut, target.node, target.port);
                    }
                })
            );
    }
}

export function updateNodePortsOut(context: GraphContext) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.out')
            .data(toPortData(context, true), selectPortKey)
            .join(enter => enter.append('g')
                .classed('graph-node-port-container out', true)
                .attr('transform', (datum) => {
                    const x = lookupPortRelativeX(context, datum.node, true);
                    const y = lookupPortRelativeY(context, datum.node, true, datum.portIndex);
                    return translate(x, y);
                })
                .call(createPorts(context))
            );
    }
}

export function updateNodePortsIn(context: GraphContext) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.in')
            .data(toPortData(context, false), selectPortKey)
            .join(enter => enter.append('g')
                .classed('graph-node-port-container in', true)
                .attr('transform', (datum) => {
                    const x = lookupPortRelativeX(context, datum.node, false);
                    const y = lookupPortRelativeY(context, datum.node, false, datum.portIndex);
                    return translate(x, y);
                })
                .call(createPorts(context))
            );
    }
}
