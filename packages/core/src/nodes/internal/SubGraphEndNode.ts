import { GraphNodeConfig } from "../../types/graphConfigTypes";
import GraphNodeLabelComponent from "./GraphNodeLabelComponent";
import { DummyNodeProcessor } from "../DummyNodeProcessor";

const PORT_IN = 'output';
const PORT_OUT_INTERNAL = '__out';

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
        return new DummyNodeProcessor();
    }
};
