import { GraphConfig, inputs, nodes as coreNodes } from '@react-ngraph/core';
import { mergeContexts } from './chartContext';
import { ChartContext, ChartParams } from "./types/contextTypes";
import { nodes } from './nodes/nodes';

export const graphConfig: GraphConfig<ChartContext, ChartParams> = {
    context: {
        columns: []
    },
    mergeContexts,
    inputs,
    nodes: {
        ...coreNodes as any,
        ...nodes
    },
    colors: {
        ports: {
            'signal': 'green',
            'row[]': 'red',
            'rowgroup[]': 'blue',
            'datapoint[]': 'orange',
            'dataset[]': 'yellow',
            'axis': 'pink',
            'column': 'purple'
        }
    }
};
