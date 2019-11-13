import { GraphNodeSpec, GraphSpec } from "./graph/types/graphSpecTypes";
import { inputs, InputType } from "./graph/components/input/standardInputs";

const grid: GraphNodeSpec = {
    title: 'Grid',
    category: 'input',
    fields: [
        { label: 'Data', name: 'data', type: InputType.DATA_GRID }
    ],
    ports: {
        in: [],
        out: [
            { name: 'rows', type: 'row[]', match: 'row[]' }
        ]
    }
}

const group: GraphNodeSpec = {
    title: 'Group',
    category: 'transform',
    fields: [
        { label: 'Column', name: 'column', type: InputType.TEXT }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row[]', match: ['row', 'row[]'] }
        ],
        out: [
            { name: 'name', type: 'scalar', match: 'scalar' },
            { name: 'group', type: 'row[]', match: 'row[]' }
        ]
    }
};

const sum: GraphNodeSpec = {
    title: 'Sum',
    category: 'transform',
    fields: [
        { label: 'Column', name: 'column', type: InputType.TEXT }
    ],
    ports: {
        in: [
            { name: 'in', type: 'row[]', match: 'row[]' }
        ],
        out: [
            { name: 'out', type: 'scalar', match: 'scalar' }
        ]
    }
};

export const spec: GraphSpec = {
    inputs,
    nodes: {
        grid,
        group,
        sum
    },
    portTypes: {
        row: {
            color: 'red'
        },
        'row[]': {
            color: 'orange'
        },
        scalar: {
            color: 'green'
        }
    },
    categories: {
        input: {
            color: 'red',
            label: 'Input'
        },
        transform: {
            color: 'blue',
            label: 'Transform'
        }
    }
};
