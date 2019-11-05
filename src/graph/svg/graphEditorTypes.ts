import { GraphNodePortSpec } from "../types/graphSpecTypes"

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
