import { GraphConfig, inputs } from '@react-ngraph/core';
import { ChartContext, mergeContexts, ChartParams } from '../chartContext';
import { DATA_GRID_NODE } from '../nodes/input/DataGridNode';
import { COMPUTE_NODE } from '../nodes/transform/ComputeNode';
import { GROUP_NODE } from '../nodes/transform/GroupNode';
import { AGGREGATE_NODE } from '../nodes/transform/AggregateNode';
import { JOIN_NODE } from '../nodes/transform/JoinNode';
import { SORT_BY_NODE } from '../nodes/transform/SortByNode';
import { CHART_NODE } from '../nodes/chart/ChartNode';
import { AXIS_NODE } from '../nodes/chart/AxisNode';
import { DATA_SET_NODE } from '../nodes/chart/DataSetNode';
import { DATA_POINT_NODE } from '../nodes/chart/DataPointNode';
import { DATA_FETCHER_NODE } from '../nodes/input/DataFetcherNode';
import { GRID_OUTPUT_NODE } from '../nodes/output/GridViewNode';

export const GRAPH_CONFIG: GraphConfig<ChartContext, ChartParams> = {
    context: {
        columns: []
    },
    mergeContexts,
    inputs,
    nodes: {
        grid: DATA_GRID_NODE,
        dataFetcher: DATA_FETCHER_NODE,
        compute: COMPUTE_NODE,
        group: GROUP_NODE,
        aggregate: AGGREGATE_NODE,
        join: JOIN_NODE,
        sortBy: SORT_BY_NODE,
        chart: CHART_NODE,
        axis: AXIS_NODE,
        dataset: DATA_SET_NODE,
        datapoint: DATA_POINT_NODE,
        gridOutput: GRID_OUTPUT_NODE
    },
    colors: {
        ports: {
            'row': 'green',
            'row[]': 'red',
            'rowgroup[]': 'blue',
            'datapoint[]': 'orange',
            'dataset[]': 'yellow',
            'axis': 'pink'
        }
    }
};
