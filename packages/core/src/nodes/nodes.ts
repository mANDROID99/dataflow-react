import { SUB_GRAPH_NODE } from "./layout/SubGraphNode";

export enum NodeType {
    SUB_GRAPH='sub-graph'
}

export const nodes = {
    [NodeType.SUB_GRAPH]: SUB_GRAPH_NODE
};
