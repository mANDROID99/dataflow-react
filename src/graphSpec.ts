import { GraphNodeSpec, GraphSpec } from "./graph/types/graphSpecTypes";

const group: GraphNodeSpec = {
    title: 'Group',
    width: 150,
    fields: [
        { label: 'Column', name: 'column', type: 'text' }
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
    title: 'Sum',
    width: 150,
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
    inputs: {
        text: {
            
        }
    },
    nodes: {
        group,
        sum
    }
};
