import { ProcessFn, GraphNodeConfig } from "../types/graphConfigTypes";
import { GraphNode } from "../types/graphTypes";

type Output = {
    subscribers: ((value: unknown) => void)[];
}

export class NodeProcessor {
    private readonly outputs = new Map<string, Output>();

    private readonly sources: NodeProcessor[] = [];
    private readonly latestValues: { [key: string]: unknown } = {};
    private readonly fn: ProcessFn;

    private running = false;
    private disposable?: (() => void) | void;
    private received = 0;

    constructor(node: GraphNode, config: GraphNodeConfig) {
        this.latestValues = this.extractInitialValues(config);
        this.onPortOutput = this.onPortOutput.bind(this);
        this.fn = config.process(node.fields);
    }

    addSource(portNameIn: string, portNameOut: string, processor: NodeProcessor) {
        this.sources.push(processor);
        processor.subscribe(portNameOut, this.onPortInput.bind(this, portNameIn));
    }

    subscribe(portName: string, fn: (value: unknown) => void): () => void {
        let portOut = this.outputs.get(portName);
        if (portOut == null) {
            portOut = { subscribers: [] };
            this.outputs.set(portName, portOut);
        }

        portOut.subscribers.push(fn);
        return this.unsubscribe.bind(this, portName, fn);
    }

    start(): void {
        if (!this.running) {
            this.running = true;
            this.received = 0;

            if (this.sources && this.sources.length > 0) {
                for (const source of this.sources) {
                    source.start();
                }
            } else {
                this.recompute();
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

    private unsubscribe(portName: string, fn: (value: unknown) => void): void {
        const portOut = this.outputs.get(portName);
        if (portOut) {
            const subs = portOut.subscribers;
            subs.splice(subs.indexOf(fn), 1);
        }
    }

    private onPortInput(portName: string, value: unknown) {
        if (this.received < this.sources.length) {
            ++this.received;
        }

        this.latestValues[portName] = value;
        if (this.received === this.sources.length) {
            this.recompute();
        }
    }

    private onPortOutput(portName: string, value: unknown) {
        const portOut = this.outputs.get(portName);
        if (portOut) {
            for (const sub of portOut.subscribers) {
                sub(value);
            }
        }
    }

    private extractInitialValues(config: GraphNodeConfig) {
        const ports = config.ports.in;
        const values: { [key: string]: unknown } = {};
        for (const portName in ports) {
            const port = ports[portName];
            values[portName] = port.initialValue;
        }
        return values;
    }

    private recompute() {
        // clear-up the previous effect
        if (this.disposable) {
            this.disposable();
        }

        this.disposable = this.fn(this.latestValues, this.onPortOutput);
    }
}
