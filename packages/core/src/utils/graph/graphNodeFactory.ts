import { GraphConfig, GraphNodeConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";
import { v4 } from "uuid";

const MIN_WIDTH = 130;
const MIN_HEIGHT = 0;

const WIDTH = 170;
const HEIGHT = 0;


export function getNodeMinWidth(nodeConfig: GraphNodeConfig<any, any>): number {
    return nodeConfig.minWidth ?? MIN_WIDTH;
}

export function getNodeMaxWidth(nodeConfig: GraphNodeConfig<any, any>): number | undefined {
    return nodeConfig.maxWidth;
}

export function getNodeMinHeight(nodeConfig: GraphNodeConfig<any, any>): number {
    return nodeConfig.minHeight ?? MIN_HEIGHT;
}

export function getNodeMaxHeight(nodeConfig: GraphNodeConfig<any, any>): number | undefined {
    return nodeConfig.maxHeight;
}

export function getNodeWidth(nodeConfig: GraphNodeConfig<any, any>): number {
    return nodeConfig.width ?? WIDTH;
}

export function getNodeHeight(nodeConfig: GraphNodeConfig<any, any>): number {
    return nodeConfig.height ?? HEIGHT;
}

export function createGraphNode(x: number, y: number, type: string, config: GraphConfig<any, any>): GraphNode {
    const nodeConfig = config.nodes[type];
    if (!nodeConfig) throw new Error('No node exists with type - ' + type);
    
    const fields: { [name: string]: unknown } = {};
    for (const [fieldName, field] of Object.entries(nodeConfig.fields)) {
        fields[fieldName] = field.initialValue;
    }

    const id = v4();
    const width = getNodeWidth(nodeConfig);
    const height = getNodeHeight(nodeConfig);

    return {
        id,
        type,
        name: nodeConfig.title,
        x,
        y,
        width,
        height,
        fields,
        ports: {
            in: {},
            out: {}
        },
    };
}
