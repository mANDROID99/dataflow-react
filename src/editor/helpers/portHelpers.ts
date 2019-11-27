import { PortRef } from "../../store/storeTypes";
import { TargetPort } from "../../types/graphTypes";
import { GraphNodePortConfig } from "../../types/graphConfigTypes";

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portId === right.portId
        && left.portOut === right.portOut;
}

export function isPortConnectable(targetPort: PortRef | undefined, portTargets: TargetPort[] | undefined, portRef: PortRef, portSpec: GraphNodePortConfig): boolean {
    if (!targetPort) {
        return false;
    }

    // must be connecting in the right direction
    if (targetPort.portOut === portRef.portOut) {
        return false;
    }

    // can't connect to itself
    if (targetPort.nodeId === portRef.nodeId) {
        return false;
    }

    if (portTargets && portTargets.length) {
        // ports can have at most one incoming connection
        if (!portRef.portOut) {
            return false;
        }        
        
        // check whether the port is already connected to the target
        for (const target of portTargets) {
            if (target.node === targetPort.nodeId && target.port === targetPort.portId) {
                return false;
            }
        }
    }

    // check whether the port-types match
    const portType = portSpec.type;
    const targetType = targetPort.portType;

    if (Array.isArray(portType)) {
        return portType.some(t => matchesType(targetType, t));
    } else {
        return matchesType(targetType, portType);
    }
}

function matchesType(type: string | string[], test: string): boolean {
    if (typeof type === 'string') {
        return type === test;
    } else {
        return type.some(t => t === test);
    }
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
