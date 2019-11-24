import { GraphNodeSpec, GraphSpec, GraphNodeType } from "../editor/types/graphSpecTypes";
import { inputs, InputType } from "../editor/components/input/standardInputs";

export type ChartContext = {
    properties: string[];
}

const grid: GraphNodeSpec = {
    input: true,
    title: 'Grid',
    type: GraphNodeType.IN,
    menuGroup: 'Input',
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
    type: GraphNodeType.TRANSFORM,
    menuGroup: 'Transform',
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
    type: GraphNodeType.TRANSFORM,
    menuGroup: 'Transform',
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

const output: GraphNodeSpec = {
    title: 'Output',
    type: GraphNodeType.OUT,
    menuGroup: 'Output',
    fields: [
        {
            label: 'Property',
            name: 'property',
            type: InputType.SELECT,
            inputParams: (context) => {
                return {
                    options: (context as ChartContext).properties
                };
            }
        }
    ],
    ports: {
        in: [
            { name: 'in', type: 'scalar', match: 'scalar' }
        ],
        out: []
    }
};

export const graphSpec: GraphSpec = {
    inputs,
    nodes: {
        grid,
        group,
        sum,
        output
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
    }
};
