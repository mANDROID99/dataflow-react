import { GraphNodeSpec, GraphSpec } from "./graph/types/graphSpecTypes";
import { inputs } from "./graph/components/input/standardInputs";

const group: GraphNodeSpec = {
    title: 'Group',
    menu: {
        label: 'Group',
        group: 'Transform'
    },
    fields: [
        { label: 'Column', name: 'column', type: 'text' }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row[]' }
        ],
        out: [
            { name: 'name', type: 'scalar' },
            { name: 'group', type: 'row[]' }
        ]
    }
};

const sum: GraphNodeSpec = {
    title: 'Sum',
    menu: {
        label: 'Sum',
        group: 'Transform'
    },
    fields: [
        { label: 'Column', name: 'column', type: 'text' }
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
    inputs,
    nodes: {
        group,
        sum
    }
};
