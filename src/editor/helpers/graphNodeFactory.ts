import { GraphSpec } from "../types/graphSpecTypes";
import { GraphNode } from "../types/graphTypes";
import { resolve } from "./inputHelpers";

export function createGraphNodeFromSpec(type: string, spec: GraphSpec, context: unknown): GraphNode {
    const fields: { [name: string]: unknown } = {};
    const nodeSpec = spec.nodes[type];
    if (!nodeSpec) throw new Error('No node exists with type - ' + type);

    for (const field of nodeSpec.fields) {
        if (field.initialValue !== undefined) {
            fields[field.name] = resolve(field.initialValue, context);

        } else {
            const inputSpec = spec.inputs[field.type];
            if (!inputSpec) throw new Error('No input exists with type - ' + field.type);
            fields[field.name] = inputSpec.initialValue;
        }
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
