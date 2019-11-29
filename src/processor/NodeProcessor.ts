import { ProcessFn, GraphNodeConfig } from "../types/graphConfigTypes";
import { GraphNode } from "../types/graphTypes";

type Output = {
    subscribers: ((value: unknown) => void)[];
}

type Input = {
    processor: NodeProcessor;
    portName: string;
}

export class NodeProcessor {
    private readonly outputs = new Map<string, Output>();
    private readonly inputs = new Map<string, Input>();

    private readonly subscriptions: (() => void)[] = [];
    private readonly latestValues: { [key: string]: unknown } = {};
    private readonly config: GraphNodeConfig;
    private readonly fn: ProcessFn;

    private disposable?: (() => void) | void;
    private nSubscribers = 0;

    constructor(node: GraphNode, config: GraphNodeConfig) {
        this.config = config;
        this.latestValues = this.extractInitialValues(config);
        this.onOutput = this.onOutput.bind(this);
        this.fn = config.process(node.fields);
    }

    setInputProcessor(portNameIn: string, portNameOut: string, processor: NodeProcessor) {
        this.inputs.set(portNameIn, {
            processor,
            portName: portNameOut,
        });
    }

    subscribe(portName: string, fn: (value: unknown) => void): () => void {
        let portOut = this.outputs.get(portName);
        if (portOut == null) {
            portOut = { subscribers: [] };
            this.outputs.set(portName, portOut);
        }

        portOut.subscribers.push(fn);

        if (this.nSubscribers++ === 0) {
            // initialization

            for (let [portName, port] of this.inputs.entries()) {
                const sub = port.processor.subscribe(port.portName, this.onInput.bind(this, portName));
                this.subscriptions.push(sub);
            }

            if (this.config.autoStart) {
                this.disposable = this.fn(this.latestValues, this.onOutput);
            }
        }

        return this.unsubscribe.bind(this, portName, fn);
    }

    private unsubscribe(portName: string, fn: (value: unknown) => void): void {
        const portOut = this.outputs.get(portName);
        if (portOut) {
            const subs = portOut.subscribers;
            subs.splice(subs.indexOf(fn), 1);
        }

        if (--this.nSubscribers === 0) {
            // uninitalization

            if (this.disposable) {
                this.disposable();
            }

            for (let unsubscribe of this.subscriptions) {
                unsubscribe();
            }

            this.subscriptions.length = 0;
        }
    }

    private onInput(portName: string, value: unknown) {
        if (this.latestValues[portName] !== value) {
            this.latestValues[portName] = value;

            // clear-up the previous effect
            if (this.disposable) {
                this.disposable();
            }

            this.disposable = this.fn(this.latestValues, this.onOutput);
        }
    }

    private onOutput(portName: string, value: unknown) {
        const portOut = this.outputs.get(portName);
        if (portOut) {
            for (let sub of portOut.subscribers) {
                sub(value);
            }
        }
    }

    private extractInitialValues(config: GraphNodeConfig) {
        const ports = config.ports.in;
        const values: { [key: string]: unknown } = {};
        for (let portName in ports) {
            const port = ports[portName];
            values[portName] = port.initialValue;
        }
        return values;
    }
}
