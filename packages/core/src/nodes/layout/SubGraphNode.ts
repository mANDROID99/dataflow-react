import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { NodeProcessor } from "../../types/processorTypes";
import { GraphNode } from "../../types/graphTypes";

import { NodeType } from "../nodes";
import SubGraphNodeComponent from "./SubGraphNodeComponent";
import { DEFAULT_NODE_WIDTH } from "../../utils/graph/graphNodeFactory";

const PORT_INPUT = 'input';
const PORT_OUTPUT = 'output';
const PORT_OUT_INTERAL = '__out';
const PORT_IN_INTERNAL = '__in';

class SubGraphNodeProcessor implements NodeProcessor {
    private readonly internalSubs: ((value: unknown) => void)[] = [];
    private readonly externalSubs: ((value: unknown) => void)[] = [];

    get type(): string {
        return NodeType.SUB_GRAPH;
    }
    
    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_OUT_INTERAL) {
            this.internalSubs.push(sub);

        } else if (portName === PORT_OUTPUT) {
            this.externalSubs.push(sub);
        }
    }

    register(portIn: string, portOut: string, processor: NodeProcessor) {
        if (portIn === PORT_IN_INTERNAL) {
            processor.subscribe(portOut, this.onNextInternal.bind(this));

        } else if (portIn === PORT_INPUT) {
            processor.subscribe(portOut, this.onNextExternal.bind(this));
        }
    }

    private onNextExternal(value: unknown) {
        for (const sub of this.internalSubs) {
            sub(value);
        }
    }

    private onNextInternal(value: unknown) {
        for (const sub of this.externalSubs) {
            sub(value);
        }
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
            [PORT_INPUT]: {
                type: null
            }
        },
        out: {
            [PORT_OUTPUT]: {
                type: null
            }
        }
    },
    component: SubGraphNodeComponent,
    createNode({ id, x, y, parent, createNodeAt }) {
        const subGraphNode: GraphNode = {
            name: 'Sub-Graph',
            type: NodeType.SUB_GRAPH,
            id, x, y, parent,
            width: DEFAULT_NODE_WIDTH,
            height: 300,
            fields: {},
            ports: {
                in: {},
                out: {}
            },
        };
        
        // construct the start node
        const startNode = createNodeAt(20, 20, id, NodeType.SUB_GRAPH_START) as GraphNode;
        const endNode = createNodeAt(50, 50, id, NodeType.SUB_GRAPH_END) as GraphNode;
        subGraphNode.subNodes = [startNode.id, endNode.id];

        // setup connnections
        subGraphNode.ports.out[PORT_OUT_INTERAL] = [{
            node: startNode.id,
            port: PORT_IN_INTERNAL
        }];

        startNode.ports.in[PORT_IN_INTERNAL] = [{
            node: id,
            port: PORT_OUT_INTERAL
        }];

        subGraphNode.ports.in[PORT_IN_INTERNAL] = [{
            node: endNode.id,
            port: PORT_OUT_INTERAL
        }];

        endNode.ports.out[PORT_OUT_INTERAL] = [{
            node: id,
            port: PORT_IN_INTERNAL
        }];

        return [
            subGraphNode,
            startNode,
            endNode
        ];
    },
    createProcessor(node, params) {
        return new SubGraphNodeProcessor();
    }
};
