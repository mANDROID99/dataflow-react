import { Processor, GraphNodeConfig } from "../types/graphConfigTypes";
import { GraphNode } from "../types/graphTypes";
import { TaskQueue } from "./TaskQueue";
import { ProcessorValuesCache } from "./ProcessorValuesCache";

type Subscriber = (value: unknown) => void;

export class GraphNodeProcessor<Params> {
    private readonly sources: GraphNodeProcessor<Params>[] = [];
    private readonly subscribers = new Map<string, Subscriber[]>();
    private readonly valuesCache: ProcessorValuesCache;
    private readonly processor: Processor;
    private readonly taskQueue: TaskQueue;

    private running = false;

    constructor(node: GraphNode, config: GraphNodeConfig<unknown, Params>, params: Params, taskQueue: TaskQueue) {
        this.valuesCache = new ProcessorValuesCache(Object.keys(config.ports.in));
        this.taskQueue = taskQueue;
        this.recompute = this.recompute.bind(this);
        
        this.processor = config.createProcessor({
            next: this.onNext.bind(this),
            node,
            params
        });
    }

    addSource(portNameIn: string, portNameOut: string, index: number, processor: GraphNodeProcessor<Params>) {
        this.sources.push(processor);
        this.valuesCache.register(portNameIn, index);

        processor.subscribe(portNameOut,
                this.onSourceNext.bind(this, portNameIn, index));
    }

    subscribe(portName: string, fn: Subscriber): void {
        let subs = this.subscribers.get(portName);
        
        if (subs == null) {
            subs = [];
            this.subscribers.set(portName, subs);
        }

        subs.push(fn);
    }

    start(): void {
        if (this.running) return;

        this.running = true;

        if (this.processor.onStart) {
            this.processor.onStart();
        }
    }

    stop(): void {
        if (!this.running) return;

        this.running = false;

        if (this.processor.onStop) {
            this.processor.onStop();
        }
    }

    private onSourceNext(portName: string, portIndex: number, value: unknown) {
        this.valuesCache.setValue(portName, portIndex, value);

        if (this.valuesCache.hasValues()) {
            if (this.processor.onNext) {
                // enqueue for processing
                this.taskQueue.enqueue(this.recompute);
            }
        }
    }

    private onNext(portName: string, value: unknown) {
        const subs = this.subscribers.get(portName);

        // notify subscribers
        if (subs && subs.length && this.running) {
            for (const sub of subs) {
                sub(value);
            }
        }
    }

    private recompute() {
        const values = this.valuesCache.getValues();

        if (this.processor.onNext) {
            this.processor.onNext(values);
        }
    }
}
