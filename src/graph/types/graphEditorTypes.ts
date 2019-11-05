import { GraphNodePortSpec } from "./graphSpecTypes";

export type PortDragTarget = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    portSpec: GraphNodePortSpec;
}

export type NodeMeasurements = {
    headerHeight: number;
    outerWidth: number;
    outerHeight: number;
}

export type Size = {
    width: number;
    height: number;
}

export type GraphActions = {
    removeNode(node: string): void;
    setNodePosition(node: string, x: number, y: number): void;
    setNodeFieldValue(node: string, field: string, value: unknown): void;
    clearPortConnections(node: string, port: string, portOut: boolean): void;
    addPortConnection(node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): void;
}
