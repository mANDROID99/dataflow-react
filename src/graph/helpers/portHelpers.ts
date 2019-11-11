import { PortDrag, PortRef } from "../../store/storeTypes";
import { TargetPort } from "../types/graphTypes";

export function comparePortRefs(left: PortRef, right: PortRef): boolean {
    return left.nodeId === right.nodeId
        && left.portId === right.portId
        && left.portOut === right.portOut;
}


export function isPortConnectable(dragPort: PortRef | undefined, portTargets: TargetPort[] | undefined, portRef: PortRef): boolean {
    if (!dragPort) {
        return false;
    } 
    
    if (portTargets) {
        for (const target of portTargets) {
            if (target.node === dragPort.nodeId && target.port === dragPort.portId) {
                return false;
            }
        }
    }

    return dragPort.nodeId !== portRef.nodeId
        && dragPort.portOut !== portRef.portOut
        && dragPort.portType === portRef.portType;
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
