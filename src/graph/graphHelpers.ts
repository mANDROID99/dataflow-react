
export function getPortId(nodeId: string, portOut: boolean, portName: string) {
    return nodeId + '/' + (portOut ? 'out' : 'in') + '/' + portName;
}
