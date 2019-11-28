import { GraphConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";
import { resolve } from "./inputHelpers";

export function createGraphNodeFromSpec(type: string, config: GraphConfig, context: unknown): GraphNode {
    const nodeConfig = config.nodes[type];
    if (!nodeConfig) throw new Error('No node exists with type - ' + type);
    
    const fields: { [name: string]: unknown } = {};
    for (const [fieldName, field] of Object.entries(nodeConfig.fields)) {
        fields[fieldName] = resolve(field.initialValue, context);
    }

    return {
        type,
        x: 150,
        y: 100,
        fields,
        ports: {
            in: {},
            out: {}
        },
    };
}
