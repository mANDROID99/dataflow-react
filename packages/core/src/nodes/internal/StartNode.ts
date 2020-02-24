import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/nodeProcessorTypes";

const PORT_INPUT = 'input';

type RegisteredConnection = {
    processor: NodeProcessor;
    port: string;
    key: number;
}

class StartNodeProcessor implements NodeProcessor {
    private targets: RegisteredConnection[] = [];

    registerConnection(portOut: string, portIn: string, processor: NodeProcessor): void {
        if (portOut === PORT_INPUT) {
            const key = processor.registerConnectionInverse(portIn);
            this.targets.push({
                key,
                port: portIn,
                processor
            });
        }
    }
    
    registerConnectionInverse(): number {
        return -1;
    }

    onNext(): void { /** do nothing */ }
    
    invoke() {
        if (this.targets.length) {
            for (const target of this.targets) {
                target.processor.onNext(target.port, target.key, null);
            }
        }
    }
}

export const START_NODE: GraphNodeConfig<any, any> = {
    title: 'Start',
    description: 'Start node',
    menuGroup: 'Internal',
    ports: {
        in: {},
        out: {
            [PORT_INPUT]: {
                type: null
            }
        }
    },
    fields: {},
    createProcessor(): NodeProcessor {
        return new StartNodeProcessor();
    }
}
