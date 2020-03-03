import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { ProxyPortsNodeProcessor } from "../ProxyPortsNodeProcessor";
import GraphNodeLabelComponent from "./GraphNodeLabelComponent";

const PORT_IN = 'output';
const PORT_OUT_INTERNAL = '__out';

const proxyPortsMapping = new Map<string, string>([
    [PORT_IN, PORT_OUT_INTERNAL]
]);

export const SUBGRAPH_END_NODE: GraphNodeConfig<any, any> = {
    title: 'End',
    description: 'Sub-graph end node',
    ports: {
        in: {
            [PORT_IN]: {
                type: null,
                multi: true,
                label: '',
                proxy: PORT_OUT_INTERNAL
            }
        },
        out: {
            [PORT_OUT_INTERNAL]: {
                type: null,
                hidden: true,
                proxy: PORT_IN
            }
        }
    },
    fields: {},
    component: GraphNodeLabelComponent,
    createProcessor() {
        return new ProxyPortsNodeProcessor(proxyPortsMapping);
    }
};
