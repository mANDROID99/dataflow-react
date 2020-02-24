import { NodeProcessor } from "../types/nodeProcessorTypes";

type Connection = {
    port: string;
    processor: NodeProcessor;
}

type RegisteredConnection = {
    processor: NodeProcessor;
    port: string;
    key: number;
}

export class ProxyPortsNodeProcessor implements NodeProcessor {
    private readonly inputs = new Map<string, RegisteredConnection[][]>();
    private readonly outputs = new Map<string, Connection[]>();

    private readonly mapping: Map<string, string>;
    private readonly inverseMapping: Map<string, string>;

    constructor(mapping: Map<string, string>) {
        this.mapping = mapping;
        this.inverseMapping = this.computeInverseMapping(mapping);
    }
    
    registerConnection(portOut: string, portIn: string, processor: NodeProcessor) {
        const proxyPortIn = this.inverseMapping.get(portOut);
        if (!proxyPortIn) {
            console.warn('Register connection. Unmapped port: ' + proxyPortIn);
            return;
        }

        const inputs = this.inputs.get(proxyPortIn);
        if (inputs) {
            for (const input of inputs) {
                const key = processor.registerConnectionInverse(portIn);
                input.push({ key, port: portIn, processor });
            }
        }

        let outputs = this.outputs.get(portOut);
        if (!outputs) {
            outputs = [];
            this.outputs.set(portOut, outputs);
        }

        outputs.push({
            port: portIn,
            processor
        });
    }

    registerConnectionInverse(portName: string): number {
        const proxyPortOut = this.mapping.get(portName);
        if (!proxyPortOut) {
            console.warn('Register connection inverse. Unmapped port: ' + portName);
            return - 1;
        }

        const outputs = this.outputs.get(proxyPortOut);

        let registrations: RegisteredConnection[];
        if (outputs) {
            registrations = outputs.map(this.createRegistration);
        } else {
            registrations = [];
        }

        let inputs = this.inputs.get(portName);
        if (!inputs) {
            inputs = [];
            this.inputs.set(portName, inputs);
        }

        inputs.push(registrations);
        return inputs.length - 1;
    }

    onNext(portName: string, key: number, value: unknown): void {
        const inputs = this.inputs.get(portName);
        if (!inputs) return;

        const proxyPortOut = this.mapping.get(portName);
        if (!proxyPortOut) return;

        const registrations = inputs[key];
        for (const binding of registrations) {
            binding.processor.onNext(binding.port, binding.key, value);
        }
    }

    private createRegistration(connection: Connection): RegisteredConnection {
        const key = connection.processor.registerConnectionInverse(connection.port);
        return { ...connection, key };
    }

    private computeInverseMapping(mapping: Map<string, string>) {
        const inverted = new Map<string, string>();

        for (const entry of mapping.entries()) {
            inverted.set(entry[1], entry[0]);
        }

        return inverted;
    }
}

