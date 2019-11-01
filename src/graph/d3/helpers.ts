import { GraphContext } from "../types/graphD3types";
import { GraphNodeSpec, GraphNodePortSpec } from "../types/graphSpecTypes";

export const HEADER_HEIGHT = 30;
export const FIELD_HEIGHT = 30;
export const CLOSE_SIZE = 20;
export const CLOSE_OVERLAY_RADIUS = 10;
export const PADDING = 5;
export const PORT_HEIGHT = 20;
export const PORT_RADIUS = 5;
export const PORT_OVERLAY_RADIUS = 10;

export function translate(x: number, y: number) {
    return `translate(${x},${y})`;
}

export function getNodeWidth(spec: GraphNodeSpec) {
    return spec.width;
}

export function getNodeHeight(spec: GraphNodeSpec) {
    const numFields = spec.fields.length;
    let height = HEADER_HEIGHT + numFields * FIELD_HEIGHT;
    
    const numPortsIn = spec.ports.in.length;
    const numPortsOut = spec.ports.out.length;
    const portsHeight = Math.max(numPortsIn, numPortsOut) * PORT_HEIGHT;

    if (portsHeight > height) {
        height = portsHeight;
    }

    return height;
}

export function lookupNodeX(context: GraphContext, nodeName: string): number {
    const graphNode = context.graph.nodes[nodeName];
    return graphNode ? graphNode.x : 0;
}

export function lookupNodeY(context: GraphContext, nodeName: string): number {
    const graphNode = context.graph.nodes[nodeName];
    return graphNode ? graphNode.y : 0;
}

export function lookupNodeWidth(context: GraphContext, nodeName: string): number {
    const node = context.graph.nodes[nodeName];
    if (node) {
        const nodeSpec = context.spec.nodes[node.type];
        if (nodeSpec) return getNodeWidth(nodeSpec);
    }
    return 0;
}

export function lookupNodeHeight(context: GraphContext, nodeName: string): number {
    const node = context.graph.nodes[nodeName];
    if (node) {
        const nodeSpec = context.spec.nodes[node.type];
        if (nodeSpec) return getNodeHeight(nodeSpec);
    }
    return 0;
}


export function lookupPortRelativeX(context: GraphContext, nodeName: string, out: boolean): number {
    const node = context.graph.nodes[nodeName];
    if (node) {
        const nodeSpec = context.spec.nodes[node.type]
        if (nodeSpec) {
            return out ? getNodeWidth(nodeSpec) : 0;
        }
    }
    return 0;
}

export function lookupPortRelativeY(context: GraphContext, nodeName: string, out: boolean, index: number): number {
    const node = context.graph.nodes[nodeName];
    if (node) {
        const nodeSpec = context.spec.nodes[node.type];
        if (nodeSpec) {
            const nodeHeight = getNodeHeight(nodeSpec);
            const numPorts = out ? nodeSpec.ports.out.length : nodeSpec.ports.in.length;
            return (nodeHeight - numPorts * PORT_HEIGHT) / 2 + (index + .5) * PORT_HEIGHT;
        }
    }
    return 0;
}

export function lookupPortX(context: GraphContext, nodeName: string, out: boolean): number {
    return lookupNodeX(context, nodeName) + lookupPortRelativeX(context, nodeName, out);
}

export function lookupPortY(context: GraphContext, nodeName: string, out: boolean, index: number): number {
    return lookupNodeY(context, nodeName) + lookupPortRelativeY(context, nodeName, out, index);
}

export function lookupPortSpec(context: GraphContext, nodeName: string, out: boolean, index: number): GraphNodePortSpec | undefined {
    const nodeSpec = context.spec.nodes[nodeName];
    if (nodeSpec) {
        const portSpec = out ? nodeSpec.ports.out : nodeSpec.ports.in;
        if (portSpec) {
            return portSpec[index];
        }
    }
}

export function lookupPortType(context: GraphContext, nodeName: string, out: boolean, index: number): string {
    const portSpec = lookupPortSpec(context, nodeName, out, index);
    return portSpec ? portSpec.type : '';
}
