import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/processorTypes";
import { NodeType } from "../nodes";

const PORT_INPUT = 'input';

class StartNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    get type(): string {
        return NodeType.START;
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_INPUT) {
            this.subs.push(sub);
        }
    }

    invoke() {
        if (this.subs.length) {
            for (const sub of this.subs) {
                sub(null);
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
