import { Processor, GraphNodeConfig } from "../types/graphConfigTypes";
import { GraphNode } from "../types/graphTypes";
import { ProcessorValues } from "./ProcessorValues";
import { TaskQueue } from "./TaskQueue";

type Subscriber = (value: unknown) => void;

export class NodeProcessor<Params> {
    private readonly sources: NodeProcessor<Params>[] = [];
    private readonly subscribers = new Map<string, Subscriber[]>();
    private readonly values: ProcessorValues;
    private readonly fn: Processor;
    
    private taskQueue: TaskQueue | undefined;
    private running = false;
    private disposable?: (() => void) | void;

    constructor(node: GraphNode, config: GraphNodeConfig<unknown, Params>, params: Params) {
        this.onProcessorResult = this.onProcessorResult.bind(this);
        this.recompute = this.recompute.bind(this);

        const initialValues = this.resolveInitialValues(Object.keys(config.ports.in));
        this.values = new ProcessorValues(initialValues);
        
        // create processor function
        this.fn = config.createProcessor({ node, params });
    }

    addSource(portNameIn: string, portNameOut: string, index: number, processor: NodeProcessor<Params>) {
        this.sources.push(processor);
        this.values.register(portNameIn, index);
        
        processor.subscribe(portNameOut,
                this.onSourceResult.bind(this, portNameIn, index));
    }

    subscribe(portName: string, fn: Subscriber): void {
        let subs = this.subscribers.get(portName);
        
        if (subs == null) {
            subs = [];
            this.subscribers.set(portName, subs);
        }

        subs.push(fn);
    }

    start(taskQueue: TaskQueue): void {
        this.taskQueue = taskQueue;
        if (!this.running) {
            this.running = true;

            if (this.sources && this.sources.length > 0) {
                for (const source of this.sources) {
                    source.start(taskQueue);
                }

            } else {
                this.taskQueue.enqueue(this.recompute);
            }
        }
    }

    stop(): void {
        if (this.running) {
            this.running = false;

            if (this.disposable) {
                this.disposable();
                this.disposable = undefined;
            }

            if (this.sources && this.sources.length > 0) {
                for (const source of this.sources) {
                    source.stop();
                }
            }
        }
    }

    private resolveInitialValues(portNames: string[]) {
        const result: { [key: string]: unknown[] } = {};

        for (const portName of portNames) {
            result[portName] = [];
        }

        return result;
    }

    private onSourceResult(portName: string, index: number, value: unknown) {
        this.values.setValue(portName, index, value);

        if (this.values.hasValue() && this.taskQueue) {
            this.taskQueue.enqueue(this.recompute);
        }
    }

    private onProcessorResult(portName: string, value: unknown) {
        const subs = this.subscribers.get(portName);

        if (subs && subs.length && this.running) {
            for (const sub of subs) {
                sub(value);
            }
        }
    }

    private recompute() {
        // clean-up previous
        if (this.disposable) {
            this.disposable();
        }

        const values = this.values.getValue();
        this.disposable = this.fn(values, this.onProcessorResult);
    }
}
