import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/processorTypes";
import { NodeType } from "../nodes";

const PORT_IN = 'input';
const PORT_OUT_INTERNAL = '__out';

class EndNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    get type(): string {
        return NodeType.SUB_GRAPH_END;
    }

    register(portIn: string, portOut: string, processor: NodeProcessor) {
        if (portIn === PORT_IN) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_OUT_INTERNAL) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        for (const sub of this.subs) {
            sub(value);
        }
    }
}

export const SUBGRAPH_END_NODE: GraphNodeConfig<any, any> = {
    title: 'End',
    description: 'Sub-graph end node',
    menuGroup: 'Internal',
    ports: {
        in: {
            [PORT_IN]: {
                type: null
            }
        },
        out: {}
    },
    fields: {},
    createProcessor() {
        return new EndNodeProcessor();
    }
}
