import React from 'react';
import { GraphState } from '../../store/storeTypes';
import { useSelector } from 'react-redux';
import { selectGraphState } from '../selectors';
import { getPortKey, getConnectionKey } from '../helpers/portHelpers';
import classNames from 'classnames';

type Props = {
    graphId: string;
    scroll: { x: number; y: number };
}

type Connection = {
    key: string;
    sx: number;
    sy: number;
    ex: number;
    ey: number;
};

function plot(sx: number, sy: number, ex: number, ey: number): string {
    return `M${sx},${sy}L${ex},${ey}`;
}

function getPortPos(state: GraphState, nodeId: string, portId: string, portOut: boolean): { x: number; y: number } | undefined {
    const node = state.graph.nodes[nodeId];
    if (!node) return;

    const portKey = getPortKey(nodeId, portId, portOut);
    const portOffset = state.ports[portKey];
    if (!portOffset) return;

    let x = node.x + portOffset.offsetX;
    let y = node.y + portOffset.offsetY;

    const nodeDrag = state.nodeDrag;
    if (nodeDrag?.node === nodeId) {
        x += nodeDrag.dragX;
        y += nodeDrag.dragY;
    }

    return { x, y };
}

function getConnections(graphState: GraphState): Connection[] {
    const connections: Connection[] = [];
    const nodes = graphState.graph.nodes;

    for (const nodeId of Object.keys(nodes)) {
        const node = nodes[nodeId];

        const ports = node.ports.out;
        for (const portId of Object.keys(ports)) {
            const portTargets = ports[portId];
            if (!portTargets) continue;

            const start = getPortPos(graphState, nodeId, portId, true);
            if (!start) continue;
            
            for (const portTarget of portTargets) {
                const end = getPortPos(graphState, portTarget.node, portTarget.port, false);
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

function renderDragConnection(state: GraphState, scroll: { x: number; y: number }): React.ReactElement | undefined {
    const drag = state.portDrag;
    if (!drag) return;

    const portRef = drag.port;
    const start = getPortPos(state, portRef.nodeId, portRef.portId, portRef.portOut);
    if (!start) return;
    
    const hasTarget = drag.target != null;

    const d = plot(start.x - scroll.x, start.y - scroll.y, drag.mouseX, drag.mouseY);
    return <path className={classNames("graph-drag-connection", { target: hasTarget })} d={d}/>;
}

export default function GraphSVG({ graphId, scroll }: Props): React.ReactElement {
    const graphState = useSelector(selectGraphState(graphId));
    const connections = graphState ? getConnections(graphState) : [];

    return (
        <svg className="graph-connections">
            {connections.map(conn => {
                const d = plot(conn.sx - scroll.x, conn.sy - scroll.y, conn.ex - scroll.x, conn.ey - scroll.y);
                return <path key={conn.key} className="graph-connection" d={d}/>;
            })}
            {graphState ? renderDragConnection(graphState, scroll) : undefined}
        </svg>
    );
}
