import { PortRef } from "../../types/graphReducerTypes";
import { GraphNode } from "../../types/graphTypes";
import { GraphConfig, GraphNodePortOutConfig, GraphNodePortInConfig } from "../../types/graphConfigTypes";

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

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portId === right.portId
        && left.portOut === right.portOut;
}

export function getPortOutConfig<Ctx, Params>(config: GraphConfig<Ctx, Params>, nodeType: string, portId: string): GraphNodePortOutConfig | undefined {
    const node = config.nodes[nodeType];
    return node ? node.ports.out[portId] : undefined;
}

export function getPortInConfig<Ctx, Params>(config: GraphConfig<Ctx, Params>, nodeType: string, portId: string): GraphNodePortInConfig | undefined {
    const node = config.nodes[nodeType];
    return node ? node.ports.in[portId] : undefined;
}

export function isPortConnectable<Ctx, Params>(portDrag: PortRef, port: PortRef, graphConfig: GraphConfig<Ctx, Params>): boolean {
    // must be connecting in the right direction
    if (portDrag.portOut === port.portOut) {
        return false;
    }

    // can't connect to itself
    if (portDrag.nodeId === port.nodeId) {
        return false;
    }

    let portOut = port;
    let portIn = portDrag;

    if (!port.portOut) {
        portOut = portDrag;
        portIn = port;
    }

    // check whether the port-types match

    const portOutConfig = getPortOutConfig(graphConfig, portOut.nodeType, portOut.portId);
    const portInConfig = getPortInConfig(graphConfig, portIn.nodeType, portIn.portId);

    if (portOutConfig && portInConfig) {
        const match = portInConfig.match;
        if (match) {
            return match(portOutConfig.type, portOut.nodeType);
        }

        const typeIn = portInConfig.type;
        const typeOut = portOutConfig.type;

        if (typeof typeIn === 'string') {
            return typeOut === typeIn;

        } else {
            return typeIn.some(m => m === typeOut);
        }
    }

    return false;
}

export function resolvePortColors<Ctx, Params>(config: GraphConfig<Ctx, Params>, port: PortRef): string[] {
    const portColors = config.colors?.ports;
    if (portColors ) {
        if (port.portOut) {
            const portConfig = getPortOutConfig(config, port.nodeType, port.portId);

            if (portConfig) {
                const color = portColors[portConfig.type];
                if (color) return [color];
            }

        } else {
            const portConfig = getPortInConfig(config, port.nodeType, port.portId);

            if (portConfig) {
                let type = portConfig.type;
                if (typeof type === 'string') {
                    type = [type];
                }
                
                return type.map(type => {
                    const color = portColors[type];
                    return color ?? DEFAULT_PORT_COLOR;
                });
            }
        }
    }

    return [];
}

export function getPortKey(nodeId: string, portId: string, portOut: boolean): string {
    return nodeId + '__' + portId + (portOut ? '__out' : '__in');
}

export function getPortKeyFromRef(port: PortRef): string {
    return getPortKey(port.nodeId, port.portId, port.portOut);
}

export function getConnectionKey(startNode: string, startPort: string, endNode: string, endPort: string): string {
    return startNode + '__' + startPort + '__' + endNode + '__' + endPort;
}
