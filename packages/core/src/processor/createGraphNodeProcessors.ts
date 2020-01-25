import { Graph } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";

import { GraphNodeProcessor } from "./GraphNodeProcessor";
import { TaskQueue } from "./TaskQueue";

export function createGraphNodeProcessors<Ctx, Params>(graph: Graph, graphConfig: GraphConfig<any, Params>, params?: Params): GraphNodeProcessor<Ctx>[] {
    const processors: GraphNodeProcessor<Params>[] = [];
    const processorsLookup = new Map<string, GraphNodeProcessor<Params>>();
    const baseParams: Params = params ?? graphConfig.params!;
    const taskQueue = new TaskQueue();

    // recursively create processors
    function getOrCreateProcessor(nodeId: string): GraphNodeProcessor<Ctx> | undefined {
        let processor = processorsLookup.get(nodeId);
        if (processor) {
            return processor;
        }

        const node = graph.nodes[nodeId];
        const nodeConfig = graphConfig.nodes[node.type];

        // create the new processor
        processor = new GraphNodeProcessor<Params>(node, nodeConfig, baseParams, taskQueue);
        processors.push(processor);
        processorsLookup.set(nodeId, processor);

        // resolve children
        const ports = node.ports.in;
        for (const portName in ports) {
            const port = ports[portName];

            if (port && port.length) {
                for (let i = 0, n = port.length; i < n; i++) {
                    const pt = port[i];
                    const sourceProcessor = getOrCreateProcessor(pt.node);

                    // add the child to the parent
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

export function runProcessors<Ctx>(processors: GraphNodeProcessor<Ctx>[]): () => void {

    // start all processors
    for (const processor of processors) {
        processor.start();
    }

    // clean-up
    return () => {
        for (const processor of processors) {
            processor.stop();
        }
    };
}
