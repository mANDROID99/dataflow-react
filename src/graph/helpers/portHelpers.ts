import { PortDrag, PortRef } from "../../store/storeTypes";
import { TargetPort } from "../types/graphTypes";

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portType === right.portId
        && left.portOut === right.portOut;
}


export function isPortConnectable(portDrag: PortDrag | undefined, portTargets: TargetPort[] | undefined, portRef: PortRef): boolean {
    if (!portDrag) {
        return false;
    } 
    
    const port = portDrag.port;
    if (portTargets) {
        for (const target of portTargets) {
            if (target.node === port.nodeId && target.port === port.portId) {
                return false;
            }
        }
    }

    return port.nodeId !== portRef.nodeId
        && port.portOut !== portRef.portOut
        && port.portType === portRef.portType;
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
