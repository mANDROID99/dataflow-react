import { GraphSpec } from "./graphSpecTypes";
import { Graph } from "./graphTypes";

export type NodeDrag = {
    node: string;
    x: number;
    y: number;
}

export type PortDrag = {
    node: string;
    port: string;
    portType: string;
    portOut: boolean;
    startX: number;
    startY: number;
    x: number;
    y: number;
}

export type PortDragTarget = {
    node: string;
    port: string;
    portOut: boolean;
    portIndex: number;
}

export type GraphActions = {
    removeNode(node: string): void;
    setNodePosition(node: string, x: number, y: number): void;
    setNodeFieldValue(node: string, field: string, value: unknown): void;
    clearPortConnections(node: string, port: string, portOut: boolean): void;
    addPortConnection(node: string, port: string, portOut: boolean, targetNode: string, targetPort: string): void;
}

export type GraphContext = {
    container: SVGSVGElement;
    spec: GraphSpec;
    actions: GraphActions;
    graph: Graph;
    
    drag?: NodeDrag;
    portDrag?: PortDrag;
    portDragTarget?: PortDragTarget;
}
