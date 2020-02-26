import { SUB_GRAPH_NODE } from "./layout/SubGraphNode";
import { SUBGRAPH_START_NODE } from "./internal/SubGraphStartNode";
import { SUBGRAPH_END_NODE } from "./internal/SubGraphEndNode";

export enum NodeType {
    SUB_GRAPH='subgraph',
    SUB_GRAPH_START='subgraph-start',
    SUB_GRAPH_END='subgraph-end'
}

export const nodes = {
    [NodeType.SUB_GRAPH]: SUB_GRAPH_NODE,
    [NodeType.SUB_GRAPH_START]: SUBGRAPH_START_NODE,
    [NodeType.SUB_GRAPH_END]: SUBGRAPH_END_NODE
};
