import { GraphConfig, inputs, nodes as coreNodes } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "./types/contextTypes";
import { nodes } from './nodes/nodes';
import { COMPUTE_CONTEXT_MERGE_INPUTS } from './chartContext';

export const graphConfig: GraphConfig<ChartContext, ChartParams> = {
    inputs,
    computeContext: COMPUTE_CONTEXT_MERGE_INPUTS,
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
