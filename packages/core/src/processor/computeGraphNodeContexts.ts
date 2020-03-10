import { GraphConfig } from "../types/graphConfigTypes";
import { Graph } from "../types/graphTypes";
import { resolvePortTargetsByProxy } from "./createProcessors";

type NodeContext<C> = {
    context: C;
    childContext: C;
}

export function createGraphNodeContextsSelector<C, P>(graphConfig: GraphConfig<C, P>, params: P | undefined) {
    let prevNodeContexts: Map<string, NodeContext<C>> | undefined;
    let prevResult: Map<string, C> | undefined;
    let prevGraph: Graph | undefined;
    let prevNodeIds: string[] | undefined;

    return (nodeIds: string[], graph: Graph): Map<string, C> => {
        
        // return previous if nothing changed
        if (graph === prevGraph && nodeIds === prevNodeIds) {
            return prevResult!;
        }

        if (params === undefined) {
            params = graphConfig.params!;
        }    

        const nodeContexts = new Map<string, NodeContext<C>>();
        const result = new Map<string, C>();
        const baseContext: C = graphConfig.context;
        const seen = new Set<string>();
        
        /**
         * recursively compute node contexts. Returns the previous context computed if
         * neither the node nor its dependencies changed
         * @param nodeId 
         */
        function getOrComputeContext(nodeId: string): NodeContext<C> {
            if (nodeContexts.has(nodeId)) {
                return nodeContexts.get(nodeId)!;
            }
    
            // infinite loop detected!
            if (seen.has(nodeId)) throw new Error(`compute contexts: cyclic dependency detected! nodeId = "${nodeId}"`);
            seen.add(nodeId);

            const node = graph.nodes[nodeId];
            const nodeConfig = graphConfig.nodes[node.type];
            const prevNode = prevGraph && prevGraph.nodes[nodeId];
            const ports = node.ports.in;

            // node is modified if the graph-node is changed
            let modified = prevNodeContexts == null || prevNode !== node;

            // gather parent contexts
            const parentContexts: C[] = [];
            for (const portName in ports) {
                const portTargets = ports[portName];
    
                if (portTargets && portTargets.length) {
                    const portTargetsByProxy = resolvePortTargetsByProxy(portTargets, graph, graphConfig, false);
                    
                    for (const portTarget of portTargetsByProxy) {
                        const parentContext = getOrComputeContext(portTarget.node);
                        parentContexts.push(parentContext.childContext);

                        // node is modified if the parent was modified
                        if (!prevNodeContexts || prevNodeContexts.get(portTarget.node) !== parentContext) {
                            modified = true;
                        }
                    }
                }
            }

            if (modified) {
                let context: C = baseContext;
                
                // compute context, starting with the base. This is basically a reduce
                if (graphConfig.mergeContexts) {
                    for (const parentContext of parentContexts) {
                        context = graphConfig.mergeContexts(context, parentContext);
                    }
                }

                // map the child context. This is the context that will be passed to downstream nodes
                const childContext: C = nodeConfig.mapContext?.({ context, params: params!, node }) ?? context;
                const nodeContext: NodeContext<C> = { context, childContext };
                nodeContexts.set(nodeId, nodeContext);
                result.set(nodeId, context);
                return nodeContext;

            } else {
                const context: NodeContext<C> = prevNodeContexts!.get(nodeId)!;
                nodeContexts.set(nodeId, context);
                result.set(nodeId, context.context);
                return context;
            }
        }
    
        for (const nodeId of nodeIds) {
            getOrComputeContext(nodeId);
        }
    
        prevNodeContexts = nodeContexts;
        prevNodeIds = nodeIds;
        prevGraph = graph;
        prevResult = result;
        return result;
    };
}
