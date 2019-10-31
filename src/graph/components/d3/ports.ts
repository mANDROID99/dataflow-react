import * as d3 from 'd3';

import { GraphNode } from "../../types/graphTypes";
import { GraphNodePortSpec, GraphSpec } from "../../types/graphSpecTypes";
import { getPortX, getPortY, translate, PORT_RADIUS } from "./measure";
import { GraphActions } from "../../graphContext";
import { pathFromTo } from './connections';

type PortDatum = {
    node: GraphNode;
    port: string;
    x: number;
    y: number;
}

type DragState = {
    x: number;
    y: number;
}

function toPortData(spec: GraphSpec, node: GraphNode, out: boolean): PortDatum[] {
    const nodeSpec = spec.nodes[node.type];
    const portSpecs = (out ? nodeSpec.ports.out : nodeSpec.ports.in);

    return portSpecs.map((port, i): PortDatum => {
        const x = getPortX(nodeSpec, out);
        const y = getPortY(nodeSpec, out, i);
        return {
            node,
            port: port.name,
            x,
            y
        };
    });
}


function createPort(spec: GraphSpec, actions: GraphActions, out: boolean) {
    let dragState: DragState | undefined;

    return (g: d3.Selection<SVGGElement, PortDatum, any, any>) => {
        g.append('circle')
            .classed('graph-node-port', true)
            .attr('r', PORT_RADIUS)
            .call(d3.drag<SVGCircleElement, PortDatum>()
                .on('start', function(p) {
                    dragState = { x: 0, y: 0 };
                })
                .on('drag', function(p) {
                    const d = dragState!;
                    d.x += d3.event.dx;
                    d.y += d3.event.dy;

                    d3.select(this.parentNode as any)
                        .selectAll('.graph-connection.dragging')
                        .data([d])
                        .join(enter => enter.append('path').classed('graph-connection dragging', true))
                            .attr('d', pathFromTo(0, 0, d.x, d.y));
                })
                .on('end', function(p) {
                    d3.select(this.parentNode as any)
                        .selectAll('.graph-connection.dragging')
                        .remove();
                })
            );
    }
}

export function createNodePortsOutUpdater(spec: GraphSpec, actions: GraphActions) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.out')
            .data(n => toPortData(spec, n, true))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container out', true)
                .attr('transform', p => translate(p.x, p.y))
                .call(createPort(spec, actions, true))
            );
    }
}

export function createNodePortsInUpdater(spec: GraphSpec, actions: GraphActions) {
    return (g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown>) => {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.in')
            .data(n => toPortData(spec, n, false))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container in', false)
                .attr('transform', p => translate(p.x, p.y))
                .call(createPort(spec, actions, false))
            );
    }
}
