import { GraphConfig } from "../types/graphConfigTypes";
import { editors } from "../editor/components/editors/standardEditors";
import { DATA_GRID_NODE } from "../nodes/DataGridNode";
import { GROUP_NODE } from "../nodes/GroupNode";
import { SUM_NODE } from "../nodes/SumNode";
import { OUTPUT_NODE } from "../nodes/OutputNode";

export type ChartContext = {
    properties: string[];
}

export const graphSpec: GraphConfig = {
    editors,
    nodes: {
        grid: DATA_GRID_NODE,
        group: GROUP_NODE,
        sum: SUM_NODE,
        output: OUTPUT_NODE
    },
    colors: {
        ports: {
            'row[]': 'orange',
            'rowgroup[]': 'red',
            'scalar[]': 'blue'
        }
    }
}
