import { Graph } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { NodeProcessor } from "../types/processorTypes";

export function createProcessorsFromGraph<Params>(graph: Graph, graphConfig: GraphConfig<any, Params>, params?: Params): NodeProcessor[] {
    const processors: NodeProcessor[] = [];
    const processorsLookup = new Map<string, NodeProcessor>();
    
    if (params === undefined) {
        params = graphConfig.params!;
    }

    // recursively create processors
    function getOrCreateProcessor(nodeId: string): NodeProcessor | undefined {
        let processor = processorsLookup.get(nodeId);
        if (processor) {
            return processor;
        }

        const node = graph.nodes[nodeId];
        const nodeConfig = graphConfig.nodes[node.type];

        // create the new processor
        processor = nodeConfig.createProcessor(node, params!);
        processors.push(processor);
        processorsLookup.set(nodeId, processor);

        // resolve children
        const ports = node.ports.in;
        for (const portName in ports) {
            const port = ports[portName];

            if (port && port.length) {
                for (const pt of port) {
                    const sourceProcessor = getOrCreateProcessor(pt.node);

                    // regsiter the child with the parent
                    if (sourceProcessor && processor.registerProcessor) {
                        processor.registerProcessor(portName, pt.port, sourceProcessor);
                    }
                }
            }
        }

        return processor;
    }

    for (const nodeId in graph.nodes) {
        getOrCreateProcessor(nodeId);
    }

    return processors;
}

export function runProcessors(processors: NodeProcessor[]): () => void {

    // start all processors
    for (const processor of processors) {
        if (processor.start) {
            processor.start();
        }
    }

    return () => {
        // clean-up
        for (const processor of processors) {
            if (processor.stop) {
                processor.stop();
            }
        }
    };
}

export function invokeProcessors(processors: NodeProcessor[]) {
    if (processors.length) {
        for (const processor of processors) {
            if (processor.invoke) {
                processor.invoke();
            }
        }
    }
}
