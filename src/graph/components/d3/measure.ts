import { GraphNodeSpec } from "../../types/graphSpecTypes";

export const HEADER_HEIGHT = 30;
export const FIELD_HEIGHT = 30;
export const CLOSE_SIZE = 20;
export const CLOSE_OVERLAY_RADIUS = 10;
export const PADDING = 5;
export const PORT_HEIGHT = 20;
export const PORT_RADIUS = 5;

export function translate(x: number, y: number) {
    return `translate(${x},${y})`;
}

export function getNodeHeight(nodeSpec: GraphNodeSpec) {
    const numFields = nodeSpec.fields.length;
    const numPortsIn = nodeSpec.ports.in.length;
    const numPortsOut = nodeSpec.ports.out.length;

    let height = HEADER_HEIGHT + numFields * FIELD_HEIGHT;

    const portsHeight = Math.max(numPortsIn, numPortsOut) * PORT_HEIGHT;
    if (portsHeight > height) {
        height = portsHeight;
    }

    return height;
}

export function getPortY(nodeSpec: GraphNodeSpec, out: boolean, index: number) {
    const nodeHeight = getNodeHeight(nodeSpec);
    const numPorts = out ? nodeSpec.ports.out.length : nodeSpec.ports.in.length;
    return (nodeHeight - numPorts * PORT_HEIGHT) / 2 + (index + .5) * PORT_HEIGHT;
}

export function getPortX(nodeSpec: GraphNodeSpec, out: boolean) {
    return out ? nodeSpec.width : 0;
}
