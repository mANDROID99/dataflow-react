import { GraphConfig, inputs } from '@react-ngraph/core';
import { ChartContext, mergeContexts, ChartParams } from './chartContext';
import { nodes } from './nodes/nodes';

export const graphConfig: GraphConfig<ChartContext, ChartParams> = {
    context: {
        columns: []
    },
    mergeContexts,
    inputs,
    nodes,
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
