import { v4 } from 'uuid';
import { GraphNodeSpec } from "../types/graphSpecTypes";
import { GraphNode } from "../types/graphTypes";

export function createGraphNodeFromSpec(type: string, nodeSpec: GraphNodeSpec): GraphNode {
    const id = v4();

    const fields: { [name: string]: unknown } = {};
    for (const field of nodeSpec.fields) {
        fields[field.name] = field.initialValue;
    }

    return {
        type,
        id,
        x: 150,
        y: 100,
        fields,
        ports: {
            in: {},
            out: {}
        },
    };
}
