import { GraphConfig, GraphNodeConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";
import { v4 } from "uuid";

const MIN_WIDTH = 130;
const MIN_HEIGHT = 0;

export const DEFAULT_NODE_WIDTH = 170;
export const DEFAULT_NODE_HEIGHT = 0;


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
    return nodeConfig.width ?? DEFAULT_NODE_WIDTH;
}

export function getNodeHeight(nodeConfig: GraphNodeConfig<any, any>): number {
    return nodeConfig.height ?? DEFAULT_NODE_HEIGHT;
}

export function graphNodeFactory(graphConfig: GraphConfig<any, any>, params: any) {
    const createNodeAt = (x: number, y: number, parent: string | undefined, type: string): GraphNode | GraphNode[] => {
        const nodeConfig = graphConfig.nodes[type];
        if (!nodeConfig) throw new Error(`Error creating node. No node exists for type "${type}"`);

        const id = v4();
        

        // the node-config can define its own factory
        if (nodeConfig.createNode) {
            return nodeConfig.createNode({
                id, x, y, params, createNodeAt, parent
            });
        }

        const width = getNodeWidth(nodeConfig);
        const height = getNodeHeight(nodeConfig);

        // resolve node fields
        const fields: { [name: string]: unknown } = {};
        for (const [fieldName, field] of Object.entries(nodeConfig.fields)) {
            fields[fieldName] = field.initialValue;
        }

        // construct the node the standard way
        return {
            id,
            type,
            name: nodeConfig.title,
            x,
            y,
            width,
            height,
            fields,
            parent,
            ports: {
                in: {},
                out: {}
            },
        };
    }

    return createNodeAt;
}
