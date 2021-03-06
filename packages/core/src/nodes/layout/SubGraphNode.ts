import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { GraphNode } from "../../types/graphTypes";
import { DEFAULT_NODE_WIDTH } from "../../utils/graph/graphNodeFactory";
import { DummyNodeProcessor } from "../DummyNodeProcessor";
import { NodeType } from "../nodes";
import SubGraphNodeComponent from "./SubGraphNodeComponent";

const PORT_IN = 'input';
const PORT_OUT = 'output';
const PORT_OUT_INTERAL = '__out';
const PORT_IN_INTERNAL = '__in';

export const SUB_GRAPH_NODE: GraphNodeConfig<any, any> = {
    title: 'Sub-Graph',
    menuGroup: 'Layout',
    description: 'Sub graph',
    fields: {},
    height: 300,
    ports: {
        in: {
            [PORT_IN]: {
                type: null,
                proxy: PORT_OUT_INTERAL
            },
            [PORT_IN_INTERNAL]: {
                type: null,
                proxy: PORT_OUT,
                hidden: true
            }
        },
        out: {
            [PORT_OUT]: {
                type: null,
                proxy: PORT_IN_INTERNAL
            },
            [PORT_OUT_INTERAL]: {
                type: null,
                hidden: true,
                proxy: PORT_IN
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
        const endNode = createNodeAt(100, 100, id, NodeType.SUB_GRAPH_END) as GraphNode;
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
        return new DummyNodeProcessor();
    }
};
