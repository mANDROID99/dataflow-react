import { NodeProcessor } from "../types/nodeProcessorTypes";

class ValuesCollector {
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

    hasValue(): boolean {
        return this.n > 0;
    }

    registerOne(): number {
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

type InputConnection = {
    port: string;
    processor: NodeProcessor;
}

type OutputConnection = {
    processor: NodeProcessor;
    port: string;
    key: number;
}

type InputPort = {
    value: ValuesCollector;
    connections: InputConnection[];
}

type OutputPort = {
    connections: OutputConnection[];
}

export abstract class BaseNodeProcessor implements NodeProcessor {
    protected readonly outputs = new Map<string, OutputPort>();
    protected readonly inputs = new Map<string, InputPort>();
    private _isReady = false;
    
    abstract process(portName: string, values: unknown[]): void;

    registerConnection(portOut: string, portIn: string, processor: NodeProcessor): void {
        const key = processor.registerConnectionInverse(portOut, portIn, this);
        const conn: OutputConnection = {
            processor,
            port: portIn,
            key
        };

        let output: OutputPort | undefined = this.outputs.get(portOut);
        if (!output) {
            output = { connections: [conn] };
            this.outputs.set(portOut, output);

        } else {
            output.connections.push(conn);
        }
    }

    registerConnectionInverse(portOut: string, portIn: string, processor: NodeProcessor): number {
        const conn: InputConnection = {
            port: portOut,
            processor
        };

        let input: InputPort | undefined = this.inputs.get(portIn);
        if (!input) {
            const value = new ValuesCollector(portIn, this.process.bind(this));
            input = { connections: [conn], value };
            this.inputs.set(portIn, input);

        } else {
            input.connections.push(conn);
        }

        return input.value.registerOne();
    }

    onNext(portName: string, key: number, value: unknown): void {
        const input = this.inputs.get(portName);
        if (!input) return;
        input.value.setValue(key, value);
    }

    isReady() {
        if (!this._isReady) {
            for (const v of this.inputs.values()) {
                if (!v.value.hasValue()) {
                    return;
                }
            }
            this._isReady = true;
        }

        return this._isReady;
    }

    protected emitResult(portName: string, value: unknown): void {
        const output = this.outputs.get(portName);
        if (!output) return;

        for (const conn of output.connections) {
            conn.processor.onNext(conn.port, conn.key, value);
        }
    }
}
