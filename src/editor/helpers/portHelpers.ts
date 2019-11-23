import { PortRef } from "../../store/storeTypes";
import { TargetPort } from "../types/graphTypes";
import { GraphNodePortSpec } from "../types/graphSpecTypes";

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portId === right.portId
        && left.portOut === right.portOut;
}


export function isPortConnectable(targetPort: PortRef | undefined, portTargets: TargetPort[] | undefined, portRef: PortRef, portSpec: GraphNodePortSpec): boolean {
    // check whether the target node can be connected to
    if (!targetPort || targetPort.portOut === portRef.portOut || targetPort.nodeId === portRef.nodeId) {
        return false;
    } 
    
    // check whether the port is already connected to the target
    if (portTargets) {
        for (const target of portTargets) {
            if (target.node === targetPort.nodeId && target.port === targetPort.portId) {
                return false;
            }
        }
    }

    // check whether the target port-type is connectable
    if (portSpec.match) {
        if (typeof portSpec.match === 'string') {
            return portSpec.match === targetPort.portType;

        } else if (Array.isArray(portSpec.match)) {
            return portSpec.match.some(m => m === targetPort.portType);

        } else {
            return portSpec.match(targetPort.portType, targetPort.nodeType);
        }
    }

    return true;
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
