import { Graph } from "../types/graphTypes";
import { GraphConfig, GraphNodeConfig } from "../types/graphConfigTypes";
import { NodeProcessor } from "./NodeProcessor";

export class GraphProcessor {
    private readonly processors: NodeProcessor[];
    private readonly subscribers: ((index: number, value: unknown) => void)[] = [];
    private readonly subscriptions: (() => void)[] = [];

    constructor(processors: NodeProcessor[]) {
        this.processors = processors;
    }

    static fromGraph(graph: Graph, graphConfig: GraphConfig): GraphProcessor {
        const outputs: NodeProcessor[] = [];
        const processors: Map<string, NodeProcessor> = new Map();

        // convert nodes to processors
        for (const nodeId in graph.nodes) {
            const node = graph.nodes[nodeId];
            const nodeConfig = graphConfig.nodes[node.type];
            const processor = new NodeProcessor(node, nodeConfig);
            processors.set(nodeId, processor);

            if (nodeConfig.isOutput) {
                outputs.push(processor);
            }
        }

        // create subscriptions between processors
        for (const nodeId in graph.nodes) {
            const node = graph.nodes[nodeId];
            const processor = processors.get(nodeId);
            if (!processor) continue;

            const inPorts = node.ports.in;
            for (const portName in inPorts) {
                const inPort = inPorts[portName];

                if (inPort && inPort.length) {
                    const sourceProcessor = processors.get(inPort[0].node);
                    if (sourceProcessor) {
                        processor.setInputProcessor(portName, inPort[0].port, sourceProcessor);
                    }
                }
            }
        }

        return new GraphProcessor(outputs);
    }
    
    subscribe(fn: (index: number, value: unknown) => void): () => void {
        this.subscribers.push(fn);

        if (this.subscribers.length === 1) {
            // initialize

            for (let i = 0, n = this.processors.length; i < n; i++) {
                const sub = this.processors[i].subscribe('out', this.onResult.bind(this, i));
                this.subscriptions.push(sub);
            }
        }

        return this.unsubscribe.bind(this, fn);
    }

    private unsubscribe(fn: (index: number, value: unknown) => void) {
        this.subscribers.splice(this.subscribers.indexOf(fn), 1);

        if (!this.subscribers.length) {
            // uninitialize

            for (const unsubscribe of this.subscriptions) {
                unsubscribe();
            }

            this.subscriptions.length = 0;
        }
    }

    private onResult(index: number, result: unknown) {
        for (const sub of this.subscribers) {
            sub(index, result);
        }
    }
}
