import { GraphConfig } from "../types/graphConfigTypes";
import { editors } from "../editor/components/editors/standardEditors";
import { DATA_GRID_NODE } from "../processor/nodes/DataGridNode";
import { GROUP_NODE } from "../processor/nodes/GroupNode";
import { SUM_NODE } from "../processor/nodes/SumNode";
import { OUTPUT_NODE } from "../processor/nodes/OutputNode";
import { JOIN_NODE } from "../processor/nodes/JoinNode";

export type ChartContext = {
    properties: string[];
}

export const graphConfig: GraphConfig = {
    editors,
    nodes: {
        grid: DATA_GRID_NODE,
        group: GROUP_NODE,
        sum: SUM_NODE,
        join: JOIN_NODE,
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
