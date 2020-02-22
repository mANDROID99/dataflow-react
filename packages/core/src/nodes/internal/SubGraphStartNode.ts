import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/processorTypes";
import { NodeType } from "../nodes";

const PORT_OUT = 'output';
const PORT_IN_INTERNAL = '__in';

class EndNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    get type(): string {
        return NodeType.SUB_GRAPH_END;
    }

    register(portIn: string, portOut: string, processor: NodeProcessor) {
        if (portIn === PORT_IN_INTERNAL) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_OUT) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        for (const sub of this.subs) {
            sub(value);
        }
    }
}

export const SUBGRAPH_START_NODE: GraphNodeConfig<any, any> = {
    title: 'Start',
    description: 'Sub-graph start node',
    menuGroup: 'Internal',
    ports: {
        in: {},
        out: {
            [PORT_OUT]: {
                type: null
            }
        }
    },
    fields: {},
    createProcessor() {
        return new EndNodeProcessor();
    }
}
