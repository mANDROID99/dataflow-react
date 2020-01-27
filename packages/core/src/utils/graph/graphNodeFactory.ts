import { GraphConfig, GraphNodeConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";

const MAX_WIDTH = 500;
const WIDTH = 170;
const MIN_WIDTH = 130;

export function getNodeMinWidth(nodeConfig: GraphNodeConfig<any>) {
    return nodeConfig.minWidth ?? MIN_WIDTH;
}

export function getNodeMaxWidth(nodeConfig: GraphNodeConfig<any>) {
    return nodeConfig.maxWidth ?? MAX_WIDTH;
}

export function getNodeWidth(nodeConfig: GraphNodeConfig<any>) {
    return nodeConfig.width ?? WIDTH;
}

export function createGraphNode(id: string, x: number, y: number, type: string, config: GraphConfig<any, any>): GraphNode {
    const nodeConfig = config.nodes[type];
    if (!nodeConfig) throw new Error('No node exists with type - ' + type);
    
    const fields: { [name: string]: unknown } = {};
    for (const [fieldName, field] of Object.entries(nodeConfig.fields)) {
        fields[fieldName] = field.initialValue;
    }

    const width = getNodeWidth(nodeConfig);

    return {
        id,
        type,
        x,
        y,
        width,
        fields,
        ports: {
            in: {},
            out: {}
        },
    };
}