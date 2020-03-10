import { GraphConfig, inputs as coreInputs, nodes as coreNodes } from '@react-ngraph/core';
import { BASE_CONTEXT, mergeContexts } from './chartContext';
import { inputs } from './inputs/inputs';
import { nodes } from './nodes/nodes';
import { ChartContext, ChartParams } from "./types/contextTypes";

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
            'column': 'purple',
            'column[]': 'brown'
        }
    }
};
