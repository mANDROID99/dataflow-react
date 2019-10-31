import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { Graph, GraphNode } from "../types/graphTypes";
import { GraphSpec, GraphNodePortSpec, GraphNodeSpec } from '../types/graphSpecTypes';
import { GraphActions } from '../graphContext';

library.add(faTimes);

type Props = {
    graph: Graph;
    spec: GraphSpec;
    actions: GraphActions;
}

type PortDatum = {
    node: GraphNode;
    spec: GraphNodePortSpec;
    out: boolean;
    numPorts: number;
}

type ConnectionDatum = {
    startNode: string;
    startPort: string;
    endNode: string;
    endPort: string;

    sx: number;
    sy: number;
    ex: number;
    ey: number;
}

const HEADER_HEIGHT = 30;
const FIELD_HEIGHT = 30;
const CLOSE_SIZE = 20;
const CLOSE_OVERLAY_RADIUS = 10;
const PADDING = 5;
const PORT_HEIGHT = 20;
const PORT_RADIUS = 5;

function translate(x: number, y: number) {
    return `translate(${x},${y})`;
}

function getNodeHeight(nodeSpec: GraphNodeSpec) {
    const numFields = nodeSpec.fields.length;
    const numPortsIn = nodeSpec.ports.in.length;
    const numPortsOut = nodeSpec.ports.out.length;

    let height = HEADER_HEIGHT + numFields * FIELD_HEIGHT;

    const portsHeight = Math.max(numPortsIn, numPortsOut) * PORT_HEIGHT;
    if (portsHeight > height) {
        height = portsHeight;
    }

    return height;
}

function getPortRelativeY(nodeSpec: GraphNodeSpec, out: boolean, index: number) {
    const nodeHeight = getNodeHeight(nodeSpec);
    const numPorts = out ? nodeSpec.ports.out.length : nodeSpec.ports.in.length;
    return (nodeHeight - numPorts * PORT_HEIGHT) / 2 + (index + .5) * PORT_HEIGHT;
}

function getPortRelativeX(nodeSpec: GraphNodeSpec, out: boolean) {
    return out ? nodeSpec.width : 0;
}

function createGraphEditor(el: SVGSVGElement, spec: GraphSpec, actions: GraphActions) {
    const svg = d3.select<SVGSVGElement, Graph>(el);
    let graph!: Graph;
    
    function selectNodeSpec(node: GraphNode) {
        return spec.nodes[node.type];
    }

    function selectNodeWidth(node: GraphNode) {
        const nodeSpec = spec.nodes[node.type];
        return nodeSpec.width;
    }

    function selectNodeHeight(node: GraphNode) {
        const nodeSpec = spec.nodes[node.type];
        return getNodeHeight(nodeSpec);
    }

    function toConnectionData(graph: Graph): ConnectionDatum[] {
        const connections: ConnectionDatum[] = [];
        for (let [startNodeId, startNode] of Object.entries(graph.nodes)) {
            const startX = startNode.x;
            const startY = startNode.y;

            const startNodeSpec = spec.nodes[startNode.type];
            const startXOff = getPortRelativeX(startNodeSpec, true);

            let i = 0;
            for (let portSpec of startNodeSpec.ports.out) {
                const startPortName = portSpec.name;
                const port = startNode.ports.out[startPortName];

                if (port) {
                    const startYOff = getPortRelativeY(startNodeSpec, true, i);

                    const endNode = graph.nodes[port.node];
                    const endX = endNode.x;
                    const endY = endNode.y;
                    
                    const endNodeSpec = spec.nodes[endNode.type];
                    const j = endNodeSpec.ports.in.findIndex(p => p.name === port.port);

                    const endXOff = getPortRelativeX(endNodeSpec, false);
                    const endYOff = getPortRelativeY(endNodeSpec, false, j);

                    connections.push({
                        startNode: startNodeId,
                        startPort: startPortName,
                        endNode: port.node,
                        endPort: port.port,

                        sx: startX + startXOff,
                        sy: startY + startYOff,
                        ex: endX + endXOff,
                        ey: endY + endYOff
                    });
                }
                i++;
            }
        }
        return connections;
    }

    function selectConnectionKey(datum: ConnectionDatum): string {
        return [datum.startNode, datum.startPort, datum.endNode, datum.endPort].join('__');
    }

    function toPortData(node: GraphNode, out: boolean): PortDatum[] {
        const nodeSpec = spec.nodes[node.type];
        const portSpecs = (out ? nodeSpec.ports.out : nodeSpec.ports.in);
        const numPorts = portSpecs.length;
        return portSpecs.map((spec): PortDatum => ({
            node,
            spec,
            out,
            numPorts
        }));
    }

    function updateGraphConnections(svg: d3.Selection<SVGSVGElement, Graph, null, unknown>) {
        svg.selectAll<SVGPathElement, ConnectionDatum>('.graph-connection')
            .data(toConnectionData, selectConnectionKey)
            .join(enter => enter.append('path')
                .classed('graph-connection', true)
                .attr('data-start-node', c => c.startNode)
                .attr('data-start-port', c => c.startPort)
                .attr('data-end-node', c => c.endNode)
                .attr('data-end-port', c => c.endPort)
            )
            .attr('d', (conn) => {
                return `M${conn.sx},${conn.sy}L${conn.ex},${conn.ey}`;
            });
    }

    function updateGraphConnectionsForNode(node: GraphNode, x: number, y: number) {
        const nodeId = node.id;
        const nodeSpec = spec.nodes[node.type];
        const portsIn = node.ports.in;
        const portsOut = node.ports.out;

        let i = 0;
        for (let portSpec of nodeSpec.ports.out) {
            const portName = portSpec.name;
            const port = portsOut[portName];

            if (port) {
                const sx = x + getPortRelativeX(nodeSpec, true);
                const sy = y + getPortRelativeY(nodeSpec, true, i);

                const endNodeName = port.node;
                const endPortName = port.port;

                const endNode = graph.nodes[endNodeName];
                const endNodeSpec = spec.nodes[endNode.type];
                const endPortIndex = endNodeSpec.ports.in.findIndex(p => p.name === endPortName);

                const ex = endNode.x + getPortRelativeX(endNodeSpec, false); 
                const ey = endNode.y + getPortRelativeY(endNodeSpec, false, endPortIndex);

                svg.selectAll<SVGPathElement, ConnectionDatum>(`.graph-connection[data-start-node=${nodeId}][data-start-port=${portName}][data-end-node=${endNodeName}][data-end-port=${endPortName}]`)
                    .attr('d', `M${sx},${sy}L${ex},${ey}`);
            }
            i++;
        }

        i = 0;
        for (let portSpec of nodeSpec.ports.in) {
            const portName = portSpec.name;
            const port = portsIn[portName];

            if (port) {
                const ex = x + getPortRelativeX(nodeSpec, false);
                const ey = y + getPortRelativeY(nodeSpec, false, i);

                const startNodeName = port.node;
                const startPortName = port.port;

                const startNode = graph.nodes[startNodeName];
                const startNodeSpec = spec.nodes[startNode.type];
                const startPortIndex = startNodeSpec.ports.out.findIndex(p => p.name === startPortName);

                const sx = startNode.x + getPortRelativeX(startNodeSpec, true); 
                const sy = startNode.y + getPortRelativeY(startNodeSpec, true, startPortIndex);

                svg.selectAll<SVGPathElement, ConnectionDatum>(`.graph-connection[data-start-node=${startNodeName}][data-start-port=${startPortName}][data-end-node=${nodeId}][data-end-port=${portName}]`)
                    .attr('d', `M${sx},${sy}L${ex},${ey}`);
            }
            i++;
        }
    }

    function updateGraphNodePortsOut(g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, Graph>) {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.out')
            .data(n => toPortData(n, true))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container out', true)
                .attr('transform', (p, i) => {
                    const nodeSpec = spec.nodes[p.node.type];
                    const x = getPortRelativeX(nodeSpec, true);
                    const y = getPortRelativeY(nodeSpec, true, i);
                    return translate(x, y);
                })
                .call(g => {
                    g.append('circle')
                        .classed('graph-node-port', true)
                        .attr('r', PORT_RADIUS)
                })
            );
    }

    function updateGraphNodePortsIn(g: d3.Selection<SVGGElement, GraphNode, SVGSVGElement, Graph>) {
        g.selectAll<SVGGElement, PortDatum>('.graph-node-port-container.in')
            .data(n => toPortData(n, false))
            .join(enter => enter.append('g')
                .classed('graph-node-port-container in', false)
                .attr('transform', (p, i) => {
                    const nodeSpec = spec.nodes[p.node.type];
                    const x = getPortRelativeX(nodeSpec, false);
                    const y = getPortRelativeY(nodeSpec, false, i);
                    return translate(x, y);
                })
                .call(g => {
                    g.append('circle')
                        .classed('graph-node-port', true)
                        .attr('r', PORT_RADIUS)
                })
            );
    }

    const drag = d3.local<{ dx: number, dy: number }>();

    function createGraphNodes(sel: d3.Selection<d3.EnterElement, GraphNode, SVGSVGElement, Graph>): d3.Selection<SVGGElement, GraphNode, SVGSVGElement, Graph> {
        return sel.append('g')
            .classed('graph-node', true)
            .call(g => {
                g.append('rect')
                    .classed('graph-node-container', true)
                    .attr('width', selectNodeWidth)
                    .attr('height', selectNodeHeight)
                    .call(d3
                        .drag<SVGRectElement, GraphNode>()
                        .container(el)
                        .on('start', function() {
                            drag.set(this, { dx: 0, dy: 0 });
                        })
                        .on('drag', function(n: GraphNode) {
                            const d = drag.get(this)!;
                            d.dx += d3.event.dx;
                            d.dy += d3.event.dy;

                            const x = n.x + d.dx;
                            const y = n.y + d.dy;

                            const parent = this.parentNode as SVGGElement;
                            parent.setAttribute('transform', translate(x, y));
                            updateGraphConnectionsForNode(n, x, y);
                        })
                        .on('end', function(n: GraphNode) {
                            const d = drag.get(this)!;
                            drag.remove(this);

                            const x = n.x + d.dx;
                            const y = n.y + d.dy;
                            actions.onNodePosChanged(n.id, x, y);
                        })
                    );

                g.append('text')
                    .classed('graph-node-title', true)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .text(n => selectNodeSpec(n).title)
                    .attr('x', n => selectNodeWidth(n) / 2)
                    .attr('y', HEADER_HEIGHT / 2);

                g.append('g')
                    .classed('graph-node-close', true)
                    .attr('transform', n => {
                        const x = selectNodeWidth(n) - CLOSE_SIZE - PADDING;
                        const y = PADDING;
                        return translate(x, y);
                    })
                    .call(closeG => {
                        closeG.append('circle')
                            .classed('graph-node-close-overlay', true)
                            .attr('cx', CLOSE_SIZE / 2)
                            .attr('cy', CLOSE_SIZE / 2)
                            .attr('r', CLOSE_OVERLAY_RADIUS)
                            .on('click', n => {
                                actions.onNodeRemoved(n.id);
                            });

                        closeG.append('foreignObject')
                            .classed('graph-node-close-icon', true)
                            .attr('width', CLOSE_SIZE)
                            .attr('height', CLOSE_SIZE)
                            .style('line-height', CLOSE_SIZE + 'px')
                            .style('pointer-events', 'none')
                            .html('<i class="fas fa-times"></i>');
                    });
            })
    }

    function updateGraphNodes(sel: d3.Selection<SVGSVGElement, Graph, null, undefined>) {
        sel.selectAll<SVGGElement, GraphNode>('.graph-node')
            .data(graph => Object.values(graph.nodes), node => node.id)
            .join(createGraphNodes)
            .call(g => {
                g.attr('transform', n => translate(n.x, n.y));

                // propagates the current datum to the container element so
                // the drag behaviour works with updated data
                g.select('.graph-node-container');
            })
            .call(updateGraphNodePortsOut)
            .call(updateGraphNodePortsIn);
    }

    return (g: Graph) => {
        graph = g;
        svg.datum(g)
            .call(updateGraphConnections)
            .call(updateGraphNodes);
    }
}

export default function Graphd3({ graph, spec, actions }: Props) {
    const elRef = useRef<SVGSVGElement>(null);
    const editorRef = useRef<(graph: Graph) => void>();

    useEffect(() => {
        const el = elRef.current;
        if (el) {
            let editor = editorRef.current;
            if (!editor) {
                editor = createGraphEditor(el, spec, actions);
                editorRef.current = editor;
            }
            editor(graph);
        }
    }, [graph]);

    return (
        <svg className="graph-svg" ref={elRef} width="800" height="600">
        </svg>
    );
}
