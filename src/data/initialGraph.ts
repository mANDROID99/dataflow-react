import { Graph } from "../types/graphTypes";

export const initialGraph: Graph = {
    nodes: {
      'node-1': {
        type: 'data-grid',
        title: 'Datagrid-1',
        config: {
          columns: ['a', 'b'],
          rows: [
            ['foo', 'bar'],
            ['baz', 'gaz']
          ]
        },
        x: 50,
        y: 70
      },
      'node-2': {
        type: 'grid-widget',
        x: 150,
        y: 100,
        config: {
          widgetName: '',
          columns: []
        }
      }
    },
    nodeIds: [
        'node-1',
        'node-2'
    ],
    connections: []
  }

