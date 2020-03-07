import { DATA_GRID_NODE } from "./input/DataGridNode";
import { DATA_FETCHER_NODE } from "./input/DataFetcherNode";
import { COMPUTE_NODE } from "./transform/ComputeNode";
import { GROUP_NODE } from "./transform/GroupNode";
import { AGGREGATE_NODE } from "./transform/AggregateNode";
import { JOIN_NODE } from "./transform/JoinNode";
import { SORT_BY_NODE } from "./transform/SortByNode";
import { CHART_VIEW_NODE } from "./chart/ChartViewNode";
import { CHART_AXIS_NODE } from "./chart/ChartAxisNode";
import { CHART_DATA_POINTS_NODE } from "./chart/ChartDataPointsNode";
import { CHART_DATA_SETS_NODE } from "./chart/ChartDataSetNode";
import { GRID_VIEW_NODE } from "./grid/GridViewNode";
import { GRID_COLUMN_NODE } from './grid/GridColumnNode';
import { SCHEDULER_NODE } from "./input/SchedulerNode";
import { COLOR_SCHEME_NODE } from "./styling/ColorSchemeNode";

export enum NodeType {
    DATA_GRID='data-grid',
    DATA_FETCHER='data-fetcher',
    COMPUTE='compute',
    GRID_VIEW='grid-view',
    GRID_COLUMN='grid-column',
    CHART_VIEW='chart',
    CHART_AXIS='chart-axis',
    CHART_DATA_POINTS='chart-datapoints',
    CHART_DATA_SETS='chart-datasets',
    COLOR_SCHEME='color-scheme',
    GROUP_BY='group-by',
    JOIN='join',
    SORT_BY='sortBy',
    AGGREGATE='aggregate',
    SCHEDULER='scheduler'
}

export const nodes = {
    [NodeType.DATA_GRID]: DATA_GRID_NODE,
    [NodeType.DATA_FETCHER]: DATA_FETCHER_NODE,
    [NodeType.COMPUTE]: COMPUTE_NODE,
    [NodeType.GROUP_BY]: GROUP_NODE,
    [NodeType.AGGREGATE]: AGGREGATE_NODE,
    [NodeType.JOIN]: JOIN_NODE,
    [NodeType.SORT_BY]: SORT_BY_NODE,
    [NodeType.CHART_VIEW]: CHART_VIEW_NODE,
    [NodeType.CHART_DATA_POINTS]: CHART_DATA_POINTS_NODE,
    [NodeType.CHART_DATA_SETS]: CHART_DATA_SETS_NODE,
    [NodeType.CHART_AXIS]: CHART_AXIS_NODE,
    [NodeType.GRID_VIEW]: GRID_VIEW_NODE,
    [NodeType.GRID_COLUMN]: GRID_COLUMN_NODE,
    [NodeType.SCHEDULER]: SCHEDULER_NODE,
    [NodeType.COLOR_SCHEME]: COLOR_SCHEME_NODE
};
