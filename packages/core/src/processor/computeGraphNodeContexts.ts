import { Graph } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { resolvePortTargetsByProxy } from "./createProcessors";

export function computeGraphNodeContexts<C, P>(graph: Graph, graphConfig: GraphConfig<C, P>, params: P | undefined): Map<string, C> {
    const nodeContexts = new Map<string, C>();
    const baseContext: C = graphConfig.context;
    if (params === undefined) {
        params = graphConfig.params!;
    }

    // track node-ids seen, avoid infinite loop
    const seen = new Set<string>();

    // recursively compute node contexts
    function getOrComputeContext(nodeId: string): C | undefined {
        const node = graph.nodes[nodeId];
        const nodeConfig = graphConfig.nodes[node.type];

        if (nodeContexts.has(nodeId)) {
            const context: C = nodeContexts.get(nodeId)!;
            return nodeConfig.mapContext?.({ node, context, params: params! }) ?? context;
        }

        if (seen.has(nodeId)) {
            throw new Error(`compute contexts: cyclic dependency detected! nodeId = "${nodeId}"`);
        }

        seen.add(nodeId);
        
        // compute context, starting with base context
        let context: C = baseContext;
        const ports = node.ports.in;

        for (const portName in ports) {
            const portTargets = ports[portName];

            if (portTargets && portTargets.length) {
                const portTargetsByProxy = resolvePortTargetsByProxy(portTargets, graph, graphConfig, false);

                for (const portTarget of portTargetsByProxy) {
                    const ctx = getOrComputeContext(portTarget.node);
                    if (ctx) {
                        if (graphConfig.mergeContexts) {
                            context = graphConfig.mergeContexts(context, ctx);

                        } else {
                            context = ctx;
                        }
                    }
                }
            }
        }

        nodeContexts.set(nodeId, context);
        return nodeConfig.mapContext?.({ node, context, params: params! }) ?? context;
    }

    for (const nodeId in graph.nodes) {
        getOrComputeContext(nodeId);
    }

    return nodeContexts;
}


