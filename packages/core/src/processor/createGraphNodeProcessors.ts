import { Graph } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { NodeProcessor } from "./NodeProcessor";
import { TaskQueue } from "./TaskQueue";
import { ProcessorResultsCollector } from "./ProcessorResultsCollector";

export function createGraphNodeProcessors<Ctx, Params>(graph: Graph, graphConfig: GraphConfig<any, Params>, params?: Params): Map<string, NodeProcessor<Ctx>> {
    const processors = new Map<string, NodeProcessor<Params>>();
    const baseParams: Params = params ?? graphConfig.params!;

    // recursively create processors
    function getOrCreateProcessor(nodeId: string): NodeProcessor<Ctx> | undefined {
        let processor = processors.get(nodeId);
        if (processor) {
            return processor;
        }

        const node = graph.nodes[nodeId];
        const nodeConfig = graphConfig.nodes[node.type];

        processor = new NodeProcessor<Params>(node, nodeConfig, baseParams);
        processors.set(nodeId, processor);

        // resolve children of this processor
        const ports = node.ports.in;
        for (const portName in ports) {
            const port = ports[portName];

            if (port && port.length) {
                for (let i = 0, n = port.length; i < n; i++) {
                    const pt = port[i];
                    const sourceProcessor = getOrCreateProcessor(pt.node);

                    if (sourceProcessor) {
                        processor.addSource(portName, pt.port, i, sourceProcessor);
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

export function findProcessorsByType<Ctx>(type: string, graph: Graph, processors: Map<string, NodeProcessor<Ctx>>): NodeProcessor<Ctx>[] {
    const resultProcessors: NodeProcessor<Ctx>[] = [];

    const nodes = graph.nodes;
    for (const nodeId in nodes) {
        const node = nodes[nodeId];

        if (node.type === type) {
            const processor = processors.get(nodeId);

            if (processor) {
                resultProcessors.push(processor);
            }
        }
    }
    
    return resultProcessors;
}

export function runProcessors<Ctx>(processors: NodeProcessor<Ctx>[], onResult: (results: unknown[]) => void): () => void {
    const resultCollector = new ProcessorResultsCollector(processors);

    // set-up subscription
    resultCollector.subscribe(onResult);

    const taskQueue = new TaskQueue();

    // run all processors
    for (const processor of processors) {
        processor.start(taskQueue);
    }

    // clean-up
    return () => {
        for (const processor of processors) {
            processor.stop();
        }
    };
}
