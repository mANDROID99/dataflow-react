import { GraphConfig, GraphNodePortOutConfig, GraphNodePortInConfig } from "../../types/graphConfigTypes";

export function getPortOutConfig(config: GraphConfig, nodeType: string, portId: string): GraphNodePortOutConfig | undefined {
    const node = config.nodes[nodeType];
    return node ? node.ports.out[portId] : undefined;
}

export function getPortInConfig(config: GraphConfig, nodeType: string, portId: string): GraphNodePortInConfig | undefined {
    const node = config.nodes[nodeType];
    return node ? node.ports.in[portId] : undefined;
}
