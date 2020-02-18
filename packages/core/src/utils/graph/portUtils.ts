import { GraphNode } from "../../types/graphTypes";
import { GraphConfig, GraphNodePortConfig } from "../../types/graphConfigTypes";
import { PortTarget } from "../../types/storeTypes";

export const DEFAULT_PORT_COLOR = '#808080';

export function anyPortHasOutConnection(node: GraphNode) {
    const ports = node.ports.out;
    for (const portId in ports) {
        const port = ports[portId];

        if (port && port.length > 0) {
            return true;
        }
    }

    return false;
}

export function comparePortTargets(left: PortTarget, right: PortTarget): boolean {
    return left.nodeId === right.nodeId
        && left.portName === right.portName
        && left.portOut === right.portOut;
}

export function getPortConfig(config: GraphConfig<any, any>, nodeType: string, portName: string, portOut: boolean): GraphNodePortConfig | undefined {
    const node = config.nodes[nodeType];
    if (!node) return undefined;

    return portOut
        ? node.ports.out[portName]
        : node.ports.in[portName];
}

export function isPortConnectable<Ctx, Params>(draggedPort: PortTarget, port: PortTarget, graphConfig: GraphConfig<Ctx, Params>): boolean {
    // must be connecting in the same direction
    if (draggedPort.portOut === port.portOut) {
        return false;
    }

    // can't connect to itself
    if (draggedPort.nodeId === port.nodeId) {
        return false;
    }

    // check whether the port-types match

    const p1 = getPortConfig(graphConfig, port.nodeType, port.portName, port.portOut);
    const p2 = getPortConfig(graphConfig, draggedPort.nodeType, draggedPort.portName, draggedPort.portOut);

    if (p1 && p2) {
        const t1 = p1.type;
        const t2 = p2.type;

        // null type matches anything
        if (t1 == null || t2 == null) {
            return true;
        }

        if (typeof t1 === 'string') {
            if (typeof t2 === 'string') {
                return t1 === t2;

            } else {
                return t2.some(t => t === t1);
            }

        } else {
            if (typeof t2 === 'string') {
                return t1.some(t => t === t2);

            } else {
                return t1.some(t => t2.indexOf(t) >= 0);
            }
        }
    }

    return false;
}

export function resolvePortColors<Ctx, Params>(config: GraphConfig<Ctx, Params>, port: PortTarget): string[] {
    const portColors = config.colors?.ports;

    if (portColors) {
        const portConfig = getPortConfig(config, port.nodeType, port.portName, port.portOut);

        if (portConfig) {
            let types = portConfig.type;

            if (types == null) {
                return [DEFAULT_PORT_COLOR];
            }

            if (typeof types === 'string') {
                types = [types];
            }

            return types.map(type => {
                const color = portColors[type];
                return color ?? DEFAULT_PORT_COLOR;
            });
        }
    }

    return [];
}
