import { GraphConfig, inputs } from '@react-ngraph/core';
import { ChartContext, mergeContexts, ChartParams } from '../chartContext';
import { NODES } from '../nodes/nodes';

export const GRAPH_CONFIG: GraphConfig<ChartContext, ChartParams> = {
    context: {
        columns: []
    },
    mergeContexts,
    inputs,
    nodes: NODES,
    colors: {
        ports: {
            'row': 'green',
            'row[]': 'red',
            'rowgroup[]': 'blue',
            'datapoint[]': 'orange',
            'dataset[]': 'yellow',
            'axis': 'pink',
            'column': 'purple'
        }
    }
};
