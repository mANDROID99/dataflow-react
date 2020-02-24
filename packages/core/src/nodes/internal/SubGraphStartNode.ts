import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { ProxyPortsNodeProcessor } from "../ProxyPortsNodeProcessor";

const PORT_OUT = 'input';
const PORT_IN_INTERNAL = '__in';

const proxyPortsMapping = new Map<string, string>([
    [PORT_IN_INTERNAL, PORT_OUT]
]);

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
        return new ProxyPortsNodeProcessor(proxyPortsMapping);
    }
};
