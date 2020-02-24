import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { ProxyPortsNodeProcessor } from "../ProxyPortsNodeProcessor";

const PORT_IN = 'output';
const PORT_OUT_INTERNAL = '__out';

const proxyPortsMapping = new Map<string, string>([
    [PORT_IN, PORT_OUT_INTERNAL]
]);

export const SUBGRAPH_END_NODE: GraphNodeConfig<any, any> = {
    title: 'End',
    description: 'Sub-graph end node',
    menuGroup: 'Internal',
    ports: {
        in: {
            [PORT_IN]: {
                type: null,
                multi: true
            }
        },
        out: {}
    },
    fields: {},
    createProcessor() {
        return new ProxyPortsNodeProcessor(proxyPortsMapping);
    }
};
