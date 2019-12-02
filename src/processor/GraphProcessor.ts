import { Graph } from "../types/graphTypes";
import { GraphConfig } from "../types/graphConfigTypes";
import { NodeProcessor } from "./NodeProcessor";

type ProcessorOpts<T> = {
    resultCombiner: (results: unknown[]) => T;
    graph: Graph;
    graphConfig: GraphConfig;
}


export class GraphProcessor<T> {
    private readonly inputs: NodeProcessor[];

    private readonly subscribers: ((value: T) => void)[] = [];
    private readonly subscriptions: (() => void)[] = [];

    private numResults = 0;
    private readonly results: unknown[] = [];
    private readonly options: ProcessorOpts<T>;

    constructor(inputs: ProcessorOpts<T>, outputs: NodeProcessor[]) {
        this.options = inputs;
        this.inputs = outputs;
    }

    static create<T>(options: ProcessorOpts<T>): GraphProcessor<T> {
        const graph = options.graph;
        const graphConfig = options.graphConfig;

        const inputs: NodeProcessor[] = [];
        const processorsLookup: Map<string, NodeProcessor> = new Map();

        // recursively create processors
        function getOrCreateProcessor(nodeId: string): NodeProcessor | undefined {
            const node = graph.nodes[nodeId];
            if (!node) return;

            let processor = processorsLookup.get(nodeId);
            if (processor) {
                return processor;
            }

            const nodeConfig = graphConfig.nodes[node.type];
            processor = new NodeProcessor(node, nodeConfig);
            processorsLookup.set(nodeId, processor);

            const inPorts = node.ports.in;
            for (const portName in inPorts) {
                const inPort = inPorts[portName];

                if (inPort && inPort.length) {
                    const sourceProcessor = getOrCreateProcessor(inPort[0].node);

                    if (sourceProcessor) {
                        processor.addSource(portName, inPort[0].port, sourceProcessor);
                    }
                }
            }

            return processor;
        }

        // convert nodes to processors
        for (const nodeId in graph.nodes) {
            const node = graph.nodes[nodeId];
            const nodeConfig = graphConfig.nodes[node.type];

            if (nodeConfig.isOutput) {
                const processor = getOrCreateProcessor(nodeId);
                if (processor) {
                    inputs.push(processor);
                }
            }
        }

        return new GraphProcessor(options, inputs);
    }
    
    subscribe(fn: (value: T) => void): () => void {
        this.subscribers.push(fn);

        if (this.subscribers.length === 1) {
            // initialize

            for (let i = this.inputs.length - 1; i >= 0; i--) {
                const sub = this.inputs[i].subscribe('out', this.onResult.bind(this, i));
                this.subscriptions.push(sub);
            }

            for (const processor of this.inputs) {
                processor.start();
            }
        }

        return this.unsubscribe.bind(this, fn);
    }

    private unsubscribe(fn: (value: T) => void) {
        this.subscribers.splice(this.subscribers.indexOf(fn), 1);

        if (!this.subscribers.length) {
            // uninitialize

            for (const unsubscribe of this.subscriptions) {
                unsubscribe();
            }

            this.subscriptions.length = 0;

            for (const processor of this.inputs) {
                processor.stop();
            }
        }
    }

    private onResult(index: number, result: unknown) {
        if (this.numResults < this.inputs.length) {
            ++this.numResults;
        }

        this.results[index] = result;
        
        if (this.numResults === this.inputs.length) {
            const combined = this.options.resultCombiner(this.results);
            for (const sub of this.subscribers) {
                sub(combined);
            }
        }
    }
}
