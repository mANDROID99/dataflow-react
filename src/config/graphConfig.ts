import { GraphConfig } from "../graph/types/graphConfigTypes";
import { DATA_GRID_NODE } from "./nodes/DataGridNode";
import { GROUP_NODE } from "./nodes/GroupNode";
import { SUM_NODE } from "./nodes/SumNode";
import { SELECT_NODE } from "./nodes/SelectNode";
import { OUTPUT_NODE } from "./nodes/OutputNode";
import { ChartContext } from "./nodes/chartContext";
import { mergeContexts } from './nodes/chartContext';

export const graphConfig: GraphConfig<ChartContext> = {
    mergeContexts,
    editors: {},
    nodes: {
        grid: DATA_GRID_NODE,
        group: GROUP_NODE,
        sum: SUM_NODE,
        select: SELECT_NODE,
        output: OUTPUT_NODE
    },
    colors: {
        ports: {
            'row[]': 'orange',
            'rowgroup[]': 'red',
            'scalar[]': 'blue'
        }
    }
};
