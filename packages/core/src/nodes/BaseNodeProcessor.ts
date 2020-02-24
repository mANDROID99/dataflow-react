import { NodeProcessor } from "../types/nodeProcessorTypes";

class Port {
    private readonly portName: string;
    private readonly sub: (portName: string, value: unknown[]) => void;
    private values: unknown[] | undefined;
    private n = 0;

    constructor(portName: string, sub: (portName: string, values: unknown[]) => void) {
        this.portName = portName;
        this.sub = sub;
    }

    setValue(index: number, value: unknown) {
        if (!this.values) {
            this.values = [];
        }

        this.values[index] = value;
        this.notifyChanged();
    }

    register(): number {
        return this.n++;
    }

    private notifyChanged() {
        if (!this.values) return;

        for (let i = 0; i < this.n; i++) {
            if (!(i in this.values)) return;
        }

        this.sub(this.portName, this.values);
    }
}

type RegisteredConnection = {
    processor: NodeProcessor;
    port: string;
    key: number;
}

export abstract class BaseNodeProcessor implements NodeProcessor {
    protected readonly outputs = new Map<string, RegisteredConnection[]>();
    protected readonly inputs = new Map<string, Port>();
    
    process?(portName: string, values: unknown[]): void;

    registerConnection(portOut: string, portIn: string, processor: NodeProcessor): void {
        const key = processor.registerConnectionInverse(portIn);
        const item = {
            processor,
            port: portIn,
            key
        };

        const handlers = this.outputs.get(portOut);
        if (!handlers) {
            this.outputs.set(portOut, [item]);
        } else {
            handlers.push(item);
        }
    }

    registerConnectionInverse(portName: string): number {
        if (this.process) {
            let port = this.inputs.get(portName);
            if (!port) {
                port = new Port(portName, this.process.bind(this));
                this.inputs.set(portName, port);
            }
            return port.register();
        } else {
            return -1;
        }
    }

    onNext(portName: string, key: number, value: unknown): void {
        const port = this.inputs.get(portName);
        if (!port) return;
        port.setValue(key, value);
    }

    protected emitResult(portName: string, value: unknown): void {
        const outputs = this.outputs.get(portName);
        if (!outputs) return;

        for (const output of outputs) {
            output.processor.onNext(output.port, output.key, value);
        }
    }
}
