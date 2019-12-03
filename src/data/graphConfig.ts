import { GraphConfig } from "../types/graphConfigTypes";
import { editors } from "../editor/components/editors/standardEditors";
import { DATA_GRID_NODE } from "../processor/nodes/DataGridNode";
import { GROUP_NODE } from "../processor/nodes/GroupNode";
import { SUM_NODE } from "../processor/nodes/SumNode";
import { SELECT_NODE } from "../processor/nodes/SelectNode";
import { OUTPUT_NODE } from "../processor/nodes/OutputNode";

export type ChartContext = {
    properties: string[];
}

export const graphConfig: GraphConfig = {
    editors,
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
