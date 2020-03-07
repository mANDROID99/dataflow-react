import { GraphConfig, inputs as coreInputs, nodes as coreNodes } from '@react-ngraph/core';
import { ChartContext, ChartParams } from "./types/contextTypes";
import { mergeContexts, BASE_CONTEXT } from './chartContext';
import { nodes } from './nodes/nodes';
import { inputs } from './inputs/inputs';

export const graphConfig: GraphConfig<ChartContext, ChartParams> = {
    inputs: {
        ...coreInputs,
        ...inputs
    },
    context: BASE_CONTEXT,
    mergeContexts: mergeContexts,
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
