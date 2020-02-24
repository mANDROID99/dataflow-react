import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";

import { NodeType } from "../nodes";
import SubGraphNodeComponent from "./SubGraphNodeComponent";
import { DEFAULT_NODE_WIDTH } from "../../utils/graph/graphNodeFactory";
import { ProxyPortsNodeProcessor } from "../ProxyPortsNodeProcessor";

const PORT_IN = 'input';
const PORT_OUT = 'output';
const PORT_OUT_INTERAL = '__out';
const PORT_IN_INTERNAL = '__in';

const proxyPortsMapping = new Map([
    [PORT_IN, PORT_OUT_INTERAL],
    [PORT_IN_INTERNAL, PORT_OUT]
]);

export const SUB_GRAPH_NODE: GraphNodeConfig<any, any> = {
    title: 'Sub-Graph',
    menuGroup: 'Layout',
    description: 'Sub graph',
    fields: {},
    height: 300,
    ports: {
        in: {
            [PORT_IN]: {
                type: null
            }
        },
        out: {
            [PORT_OUT]: {
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
    createProcessor() {
        return new ProxyPortsNodeProcessor(proxyPortsMapping);
    }
};
