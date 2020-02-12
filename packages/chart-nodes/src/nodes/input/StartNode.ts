import { GraphNodeConfig, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { NodeType } from "../nodes";

const PORT_SIGNAL = 'signal';

class StartNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    get type(): string {
        return NodeType.START;
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_SIGNAL) {
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

export const START_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Start',
    description: 'Start node',
    menuGroup: 'Hidden',
    ports: {
        in: {},
        out: {
            [PORT_SIGNAL]: {
                type: 'signal'
            }
        }
    },
    fields: {},
    createProcessor(): NodeProcessor {
        return new StartNodeProcessor();
    }
}
