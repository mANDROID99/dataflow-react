import { NodeProcessor } from "../types/nodeProcessorTypes";

type OutputConnection = {
    port: string;
    processor: NodeProcessor;
}

type InputProxyConnection = {
    processor: NodeProcessor;
    port: string;
    key: number;
}

export class ProxyPortsNodeProcessor implements NodeProcessor {
    private readonly inputs = new Map<string, InputProxyConnection[][]>();
    private readonly outputs = new Map<string, OutputConnection[]>();

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
                const key = processor.registerConnectionInverse(portOut, portIn, this);
                input.push({
                    key,
                    port: portIn,
                    processor
                });
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

    registerConnectionInverse(portOut: string, portIn: string): number {
        const proxyPortOut = this.mapping.get(portIn);
        if (!proxyPortOut) {
            console.warn('Register connection inverse. Unmapped port: ' + portIn);
            return - 1;
        }

        const outputs = this.outputs.get(proxyPortOut);

        let connections: InputProxyConnection[];
        if (outputs) {
            connections = outputs.map(this.outputToInputProxyConnection.bind(this, proxyPortOut));
        } else {
            connections = [];
        }

        let inputs = this.inputs.get(portIn);
        if (!inputs) {
            inputs = [];
            this.inputs.set(portIn, inputs);
        }

        inputs.push(connections);
        return inputs.length - 1;
    }

    onNext(portName: string, key: number, value: unknown): void {
        const inputs = this.inputs.get(portName);
        if (!inputs) return;

        const proxies = inputs[key];
        for (const outputProxy of proxies) {
            outputProxy.processor.onNext(outputProxy.port, outputProxy.key, value);
        }
    }

    private outputToInputProxyConnection(portOut: string, connection: OutputConnection): InputProxyConnection {
        const key = connection.processor.registerConnectionInverse(portOut, connection.port, this);
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

