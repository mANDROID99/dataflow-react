import { GraphSpec } from "../../types/graphSpecTypes";
import { GraphActions } from "../../graphContext";

export type NodeDrag = {
    node: string;
    x: number;
    y: number;
}

export type PortDrag = {
    node: string;
    port: string;
    portOut: boolean;
    x: number;
    y: number;
}

export type GraphContext = {
    svg: SVGSVGElement;
    spec: GraphSpec;
    actions: GraphActions;
    drag?: NodeDrag;
    port?: PortDrag;
}
