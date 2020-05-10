import { Graph, GraphNode } from "../types/graphTypes";
import { GraphDef } from "../types/graphDefTypes";
import { StoreState } from "../types/storeTypes";
import { NodeProcessor } from "../types/processorTypes";
import { createProcessors } from "../processor/createProcessors";

function compareGraphNodes(prev: GraphNode, next: GraphNode) {
    return prev.config !== next.config;
}

function compareGraphs(prev: Graph, next: Graph) {
    if (prev !== next) {
        if (prev.connections !== next.connections) {
            return false;
        }

        const prevNodes = prev.nodes;
        const nextNodes = next.nodes;

        for (const nodeId in prevNodes) {
            if (!(nodeId in nextNodes && compareGraphNodes(prevNodes[nodeId], nextNodes[nodeId]))) return false;
        }

        for (const nodeId in nextNodes) {
            if (!(nodeId in prevNodes)) return false;
        }
    }

    return true;
}

type Prev<Ctx> = {
    graph: Graph;
    processors: Map<string, NodeProcessor<Ctx>>;
}

export function createProcessorsSelector<Params, Ctx>(graphDef: GraphDef<Params, Ctx>, params: Params) {
    let prev: Prev<Ctx> | undefined;

    return (state: StoreState) => {
        const graph = state.editor.graph;
        if (prev && compareGraphs(prev.graph, graph)) {
            return prev.processors;
        }

        const processors = createProcessors(graphDef, graph, params);
        prev = { graph, processors };
        return processors;
    }
}
