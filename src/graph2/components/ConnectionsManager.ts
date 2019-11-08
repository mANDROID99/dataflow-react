import * as SVG from 'svg.js';
import { TargetPort } from '../types/graphTypes';

type Connection = {
    // start: PortState;
    // end: PortState;
    path: SVG.Path;
}

// tag type
type PortKey = string & { __tag: 0 };

type PortState = {
    connections: Map<PortKey, Connection>;
    x: number;
    y: number;
}

export class ConnectionsManager {

    private doc: SVG.Doc;
    private readonly ports: Map<PortKey, PortState> = new Map();

    private dragPath?: SVG.Path;

    constructor(svg: SVGSVGElement) {
        this.doc = new SVG.Doc(svg as any as HTMLElement);
    }

    setDragConnection(sx: number, sy: number, ex: number, ey: number): void {
        if (!this.dragPath) {
            this.dragPath = this.doc.path()
                .addClass('graph-drag-connection');
        }
        this.updatePath(this.dragPath, sx, sy, ex, ey);
    }

    clearDragConnection(): void {
        this.dragPath?.remove();
        this.dragPath = undefined;
    }

    mountPort(nodeId: string, portId: string, portOut: boolean, x: number, y: number): void {
        const portKey = this.getPortKey(nodeId, portId, portOut);
        if (this.ports.has(portKey)) {
            throw new Error('A port already exists with key ' + portKey);
        }

        const port = this.createPortState(x, y);
        this.ports.set(portKey, port);
    }

    unmountPort(nodeId: string, portId: string, portOut: boolean): void {
        const portKey = this.getPortKey(nodeId, portId, portOut);
        const port = this.ports.get(portKey);

        if (port) {
            this.ports.delete(portKey);

            for (const [targetKey, conn] of port.connections) {
                conn.path.remove();
                const targetPort = this.ports.get(targetKey);
                targetPort?.connections.delete(portKey);
            }
        }
    }

    updatePort(nodeId: string, portId: string, portOut: boolean, x: number, y: number, targets: TargetPort[] | undefined): void {
        const portKey = this.getPortKey(nodeId, portId, portOut);
        const port = this.ports.get(portKey);
        if (!port) {
            throw new Error('No port exists with key ' + portKey);
        }

        port.x = x;
        port.y = y;

        const connections = port.connections;
        const seen = new Set<string>();

        if (targets) {
            for (const target of targets) {
                const targetPortKey = this.getPortKey(target.node, target.port, !portOut);
                const targetPort = this.ports.get(targetPortKey);

                if (targetPort) {
                    seen.add(targetPortKey);
                    let connection: Connection | undefined = connections.get(targetPortKey);

                    if (!connection) {
                        const path = new SVG.Path()
                            .addClass('graph-connection');

                        this.doc.add(path);

                        connection = { path };
                        connections.set(targetPortKey, connection);
                        targetPort.connections.set(portKey, connection);
                        this.updatePath(path, port.x, port.y, targetPort.x, targetPort.y);

                    } else {
                        const path = connection.path;
                        this.updatePath(path, port.x, port.y, targetPort.x, targetPort.y);
                    }

                }
            }
        }

        for (const [targetPortKey, connection] of port.connections.entries()) {
            if (!seen.has(targetPortKey)) {
                connection.path.remove();
                connections.delete(targetPortKey);
                const targetPort = this.ports.get(targetPortKey);

                if (targetPort) {
                    targetPort.connections.delete(portKey);
                }
            }
        }
    }

    private getPortKey(nodeId: string, portId: string, portOut: boolean): PortKey {
        return nodeId + '__' + portId + (portOut ? '__out' : '__in') as PortKey;
    }

    private createPortState(x: number, y: number): PortState {
        return {
            connections: new Map<PortKey, Connection>(),
            x,
            y
        };
    }

    private updatePath(path: SVG.Path, sx: number, sy: number, ex: number, ey: number): void {
        const d = `M${sx},${sy}L${ex},${ey}`;
        path.plot(d);
    }
}
