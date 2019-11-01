import * as d3 from 'd3';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { GraphNode, Graph } from "../../types/graphTypes";
import { GraphSpec } from "../../types/graphSpecTypes";
import { GraphActions } from "../../graphContext";
import { getNodeHeight, translate, HEADER_HEIGHT, CLOSE_SIZE, PADDING, CLOSE_OVERLAY_RADIUS, getNodeWidth } from './helpers';
import { updateGraphConnections, updateDragConnections } from './connections';
import { updateNodePortsOut, updateNodePortsIn } from './ports';
import { GraphContext } from './types';

library.add(faTimes);

export function createGraphEditor(container: SVGSVGElement, spec: GraphSpec, actions: GraphActions) {
    let context: GraphContext = {
        container,
        spec,
        actions,
        graph: undefined as any
    }
    
    function selectNodeTitle(node: GraphNode): string {
        const nodeSpec = spec.nodes[node.type];
        return nodeSpec ? nodeSpec.title : '';
    }

    function selectNodeWidth(node: GraphNode): number {
        const nodeSpec = spec.nodes[node.type];
        return nodeSpec ? getNodeWidth(nodeSpec) : 0;
    }

    function selectNodeHeight(node: GraphNode): number {
        const nodeSpec = spec.nodes[node.type];
        return nodeSpec ? getNodeHeight(nodeSpec) : 0;
    }
    
    function createGraphNodes(sel: d3.Selection<d3.EnterElement, GraphNode, SVGSVGElement, unknown>): d3.Selection<SVGGElement, GraphNode, SVGSVGElement, unknown> {
        return sel.append('g')
            .classed('graph-node', true)
            .call(g => {
                g.append('rect')
                    .classed('graph-node-container', true)
                    .attr('width', selectNodeWidth)
                    .attr('height', selectNodeHeight)
                    .call(d3
                        .drag<SVGRectElement, GraphNode>()
                        .container(container)
                        .on('start', function(d) {
                            context.drag =  { node: d.id, x: 0, y: 0 };
                        })
                        .on('drag', function(n: GraphNode) {
                            const d = context.drag!;
                            d.x += d3.event.dx;
                            d.y += d3.event.dy;

                            const x = n.x + d.x;
                            const y = n.y + d.y;

                            const parent = this.parentNode as SVGGElement;
                            parent.setAttribute('transform', translate(x, y));
                            updateDragConnections(context, n, x, y);
                        })
                        .on('end', function(n: GraphNode) {
                            const d = context.drag!;
                            const x = n.x + d.x;
                            const y = n.y + d.y;
                            context.drag = undefined;

                            actions.onNodePosChanged(n.id, x, y);
                        })
                    );

                g.append('text')
                    .classed('graph-node-title', true)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .text(selectNodeTitle)
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

    function updateGraphNodes(graph: Graph) {
        const nodes = Object.values(graph.nodes);
        d3.select(container)
            .selectAll<SVGGElement, GraphNode>('.graph-node')
            .data(nodes, node => node.id)
            .join(createGraphNodes)
            .call(g => {
                g.attr('transform', n => translate(n.x, n.y));

                // propagates the current datum to the container element so
                // the drag behaviour works with updated data
                g.select('.graph-node-container');
            })
            .call(updateNodePortsIn(context))
            .call(updateNodePortsOut(context));
    }

    return (g: Graph) => {
        context.graph = g;
        updateGraphConnections(context);
        updateGraphNodes(g);
    }
}
