import { GraphSpec } from "../../types/graphSpecTypes";
import { GraphActions } from "../../graphContext";
import { Graph } from "../../types/graphTypes";

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

export type GraphContext = {
    container: SVGSVGElement;
    spec: GraphSpec;
    actions: GraphActions;
    graph: Graph;
    
    drag?: NodeDrag;
    portDrag?: PortDrag;
    portDragTarget?: PortDragTarget;
}
