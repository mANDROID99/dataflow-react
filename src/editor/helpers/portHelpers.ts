import { PortRef } from "../../store/storeTypes";
import { Graph } from "../../types/graphTypes";
import { GraphConfig, GraphNodePortOutConfig } from "../../types/graphConfigTypes";
import { getPortOutConfig, getPortInConfig } from "./configHelpers";

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portId === right.portId
        && left.portOut === right.portOut;
}

export function isPortConnectable(target: PortRef, port: PortRef, graph: Graph, graphConfig: GraphConfig): boolean {
    // must be connecting in the right direction
    if (target.portOut === port.portOut) {
        return false;
    }

    // can't connect to itself
    if (target.nodeId === port.nodeId) {
        return false;
    }

    let portOut = port;
    let portIn = target;

    if (!port.portOut) {
        portOut = target;
        portIn = port;
    }

    const nodeOut = graph.nodes[portOut.nodeId];
    const nodeIn = graph.nodes[portIn.nodeId];

    // check whether the port-types match

    if (nodeOut && nodeIn) {
        const portOutConfig = getPortOutConfig(graphConfig, nodeOut.type, portOut.portId);
        const portInConfig = getPortInConfig(graphConfig, nodeIn.type, portIn.portId);

        if (portOutConfig && portInConfig) {
            const match = portInConfig.match;

            if (typeof match === 'string') {
                return portOutConfig.type === match;

            } else if (typeof match === 'function') {
                return match(portOutConfig.type, nodeOut.type);

            } else {
                return match.some(m => m === portOutConfig.type);
            }
        }
    }

    return false;
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
