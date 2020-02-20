import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/processorTypes";
import { NodeType } from "../nodes";
import SubGraphNodeComponent from "./SubGraphNodeComponent";

class SubGraphNodeProcessor implements NodeProcessor {
    get type(): string {
        return NodeType.SUB_GRAPH;
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        throw new Error("Method not implemented.");
    }
}

export const SUB_GRAPH_NODE: GraphNodeConfig<any, any> = {
    title: 'Sub-Graph',
    menuGroup: 'Layout',
    description: 'Sub graph',
    fields: {},
    height: 300,
    ports: {
        in: {
            input: {
                type: null
            }
        },
        out: {
            output: {
                type: null
            }
        }
    },
    component: SubGraphNodeComponent,
    createProcessor(node, params) {
        return new SubGraphNodeProcessor();
    }
};
