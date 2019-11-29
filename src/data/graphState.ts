import { Graph } from "../types/graphTypes";
import { GraphEditorState } from "../types/storeTypes";

const INIT_GRAPH: Graph = {
    nodes: {
        grid: {
            type: 'grid',
            fields: {
                data: {
                    columns: [
                        { name: 'column1', width: 100, minWidth: 50 },
                        { name: 'column2', width: 100, minWidth: 50 }
                    ],
                    rows: [
                        ['cell1', 'cell2'],
                        ['cell3', 'cell4']
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
