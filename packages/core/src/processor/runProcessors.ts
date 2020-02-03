import { NodeProcessor } from "../types/processorTypes";
import { ComputedNode } from "../types/graphInputTypes";

export function runProcessors(processors: NodeProcessor[]): () => void {

    // start processors
    for (const processor of processors) {
        if (processor.onStart) {
            processor.onStart();
        }
    }

    return () => {
        // clean-up
        for (const processor of processors) {
            if (processor.onStop) {
                processor.onStop();
            }
        }
    };
}

export function runAllGraphNodeProcessors<Ctx>(nodes: Map<string, ComputedNode<Ctx>>) {
    const processors = [...nodes.values()].map(node => node.processor);
    return runProcessors(processors);
}
