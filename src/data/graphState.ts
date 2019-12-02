import { Graph } from "../types/graphTypes";
import { GraphEditorState } from "../types/storeTypes";

const INIT_GRAPH: Graph = {
    nodes: {
        grid: {
            type: 'grid',
            fields: {
                data: {
                    columns: [
                        { name: 'a', width: 100, minWidth: 50 },
                        { name: 'b', width: 100, minWidth: 50 }
                    ],
                    rows: [
                        ['groupA', '0'],
                        ['groupA', '1'],
                        ['groupB', '2'],
                        ['groupB', '3']
                    ]
                }
            },
            x: 120,
            y: 300,
            ports: {
                in: {},
                out: {}
            }
        },
        groupBy: {
            type: 'group',
            fields: {},
            x: 100,
            y: 120,
            ports: {
                in: {},
                out: {}
            }
        },
        sum: {
            type: 'sum',
            fields: {},
            x: 400,
            y: 200,
            ports: {
                in: {},
                out: {}
            }
        }
    }
};

export const INIT_STATE: { [id: string]: GraphEditorState } = {
    'graph-1': {
        graph: INIT_GRAPH,
        ports: {}
    }
};
