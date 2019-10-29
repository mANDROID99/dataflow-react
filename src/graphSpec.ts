import { GraphNodeSpec, GraphSpec } from "./graph/types/graphSpecTypes";
import TextInput from "./graph/inputs/TextInput";

const group: GraphNodeSpec = {
    fields: [
        { label: 'Key', name: 'key', type: 'text' }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row' }
        ],
        out: [
            { name: 'group', type: 'scalar' },
            { name: 'rows', type: 'row[]' }
        ]
    }
};

const sum: GraphNodeSpec = {
    fields: [
        { label: 'Key', name: 'key', type: 'text' }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row[]' }
        ],
        out: [
            { name: 'out', type: 'scalar' }    
        ]
    }
};

export const spec: GraphSpec = {
    inputs: {
        text: {
            component: TextInput
        }
    },
    nodes: {
        group,
        sum
    }
};
