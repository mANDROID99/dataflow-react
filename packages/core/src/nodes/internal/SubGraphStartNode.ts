import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { ProxyPortsNodeProcessor } from "../ProxyPortsNodeProcessor";
import GraphNodeLabelComponent from "./GraphNodeLabelComponent";

const PORT_OUT = 'input';
const PORT_IN_INTERNAL = '__in';

const proxyPortsMapping = new Map<string, string>([
    [PORT_IN_INTERNAL, PORT_OUT]
]);

export const SUBGRAPH_START_NODE: GraphNodeConfig<any, any> = {
    title: 'Start',
    description: 'Sub-graph start node',
    ports: {
        in: {},
        out: {
            [PORT_OUT]: {
                type: null,
                label: ''
            }
        }
    },
    fields: {},
    component: GraphNodeLabelComponent,
    createProcessor() {
        return new ProxyPortsNodeProcessor(proxyPortsMapping);
    }
};
