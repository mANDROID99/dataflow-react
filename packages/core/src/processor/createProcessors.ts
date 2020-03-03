import { Graph, TargetPort } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { NodeProcessor } from "../types/nodeProcessorTypes";

/**
 * Resolve proxy port targets.
 * Proxied ports allow processors to register directly onto another processor specified through the output port mapping.
 */
export function resolvePortTargetsByProxy<C, P>(portTargets: TargetPort[], graph: Graph, graphConfig: GraphConfig<C, P>, dirOut: boolean): TargetPort[] {
    const portTargetsByProxy: TargetPort[] = [];

    for (const portTarget of portTargets) {
        const targetNode = graph.nodes[portTarget.node];
        
        if (targetNode) {
            const targetNodeConfig = graphConfig.nodes[targetNode.type];

            if (targetNodeConfig) {
                const targetPortConfigs = dirOut ? targetNodeConfig.ports.in : targetNodeConfig.ports.out;
                const targetPortConfig = targetPortConfigs[portTarget.port];

                if (targetPortConfig && targetPortConfig.proxy) {
                    const targetPorts = dirOut ? targetNode.ports.out : targetNode.ports.in;
                    const proxyTargets = targetPorts[targetPortConfig.proxy];

                    if (proxyTargets && proxyTargets.length) {
                        const p = resolvePortTargetsByProxy(proxyTargets, graph, graphConfig, dirOut);
                        for (const p2 of p) portTargetsByProxy.push(p2);
                    }

                    continue;
                }
            }
        }

        portTargetsByProxy.push(portTarget);
    }

    return portTargetsByProxy;
}

export function createProcessorsFromGraph<C, P>(graph: Graph, graphConfig: GraphConfig<C, P>, params: P | undefined): Map<string, NodeProcessor> {
    const processsors = new Map<string, NodeProcessor>();
    if (params === undefined) {
        params = graphConfig.params!;
    }

    // track node-ids seen, avoid infinite loop
    const seen = new Set<string>();

    // recursively create processors
    function getOrCreateProcessor(nodeId: string): NodeProcessor | undefined {
        if (processsors.has(nodeId)) {
            return processsors.get(nodeId);
        }

        if (seen.has(nodeId)) {
            throw new Error(`createProcessors: cyclic dependency detected! nodeId = "${nodeId}"`);
        }

        seen.add(nodeId);
        const node = graph.nodes[nodeId];
        const nodeConfig = graphConfig.nodes[node.type];

        // create new processor
        const processor = nodeConfig.createProcessor(node, params!);
        const ports = node.ports.out;

        for (const portName in ports) {
            const portTargets = ports[portName];

            if (portTargets && portTargets.length) {
                const portTargetsByProxy = resolvePortTargetsByProxy(portTargets, graph, graphConfig, true);

                for (const pt of portTargetsByProxy) {
                    const nextProcessor = getOrCreateProcessor(pt.node);

                    // register connection with the upstream processor
                    if (nextProcessor) {
                        processor.registerConnection(portName, pt.port, nextProcessor);
                    }
                }
            }
        }

        processsors.set(nodeId, processor);
        return processor;
    }

    for (const nodeId in graph.nodes) {
        getOrCreateProcessor(nodeId);
    }

    return processsors;
}

export function runAllProcessors(processors: Map<string, NodeProcessor>): () => void {

    // start all processors
    for (const processor of processors.values()) {
        if (processor.start) {
            processor.start();
        }
    }

    return () => {
        // clean-up
        for (const processor of processors.values()) {
            if (processor.stop) {
                processor.stop();
            }
        }
    };
}

export function invokeAllProcessors(processors: Map<string, NodeProcessor>) {
    if (processors.size) {
        for (const processor of processors.values()) {
            if (processor.invoke) {
                processor.invoke();
            }
        }
    }
}
