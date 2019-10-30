export type PortId = {
    nodeId: string;
    portName: string;
    portOut: boolean;
}

export function createPortId(nodeId: string, portName: string, portOut: boolean): PortId {
    return {
        nodeId,
        portName,
        portOut
    };
}

export function portIdToKey(id: PortId) {
    return getPortKey(id.nodeId, id.portName, id.portOut);
}

export function getPortKey(nodeId: string,  portName: string, portOut: boolean) {
    return nodeId + '/' + (portOut ? 'out' : 'in') + '/' + portName;
}

export function comparePortIds(port: PortId, other: PortId) {
    return port.nodeId === other.nodeId
        && port.portName === other.portName
        && port.portOut === other.portOut;
}
