import { Graph } from "../editor/types/graphTypes";
import { GraphEditorState } from "../store/storeTypes";

const INIT_GRAPH: Graph = {
    nodes: {
        grid: {
            type: 'grid',
            fields: {
                data: {
                    columns: [],
                    rows: []
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
                out: {
                    group: [{
                        node: 'sum',
                        port: 'in'
                    }]
                }
            }
        },
        sum: {
            type: 'sum',
            fields: {},
            x: 400,
            y: 200,
            ports: {
                in: {
                    in: [{
                        node: 'groupBy',
                        port: 'group'
                    }]
                },
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
