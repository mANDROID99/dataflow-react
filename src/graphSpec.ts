import { GraphSpec, GraphNodeSpec } from "./graph/graphTypes";
import TextInput from "./graph/inputs/TextInput";

const group: GraphNodeSpec = {
    fields: [
        { label: 'Key', name: 'key', type: 'text' }
    ],
    portsIn: [
        { label: 'In', name: 'in', type: 'row' }
    ],
    portsOut: [
        { label: 'Group', name: 'group', type: 'scalar' },
        { label: 'Rows', name: 'rows', type: 'row[]' }
    ]
}

const sum: GraphNodeSpec = {
    fields: [
        { label: 'Key', name: 'key', type: 'text' }
    ],
    portsIn: [
        { label: 'In', name: 'in', type: 'row[]' }
    ],
    portsOut: [
        { label: 'Out', name: 'out', type: 'scalar' }
    ]
}

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
