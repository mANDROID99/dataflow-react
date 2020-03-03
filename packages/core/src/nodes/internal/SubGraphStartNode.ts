import { GraphNodeConfig } from "../../types/graphConfigTypes";
import GraphNodeLabelComponent from "./GraphNodeLabelComponent";
import { DummyNodeProcessor } from "../DummyNodeProcessor";

const PORT_OUT = 'input';
const PORT_IN_INTERNAL = '__in';

export const SUBGRAPH_START_NODE: GraphNodeConfig<any, any> = {
    title: 'Start',
    description: 'Sub-graph start node',
    ports: {
        in: {
            [PORT_IN_INTERNAL]: {
                type: null,
                hidden: true,
                proxy: PORT_OUT
            }
        },
        out: {
            [PORT_OUT]: {
                type: null,
                label: '',
                proxy: PORT_IN_INTERNAL
            }
        }
    },
    fields: {},
    component: GraphNodeLabelComponent,
    createProcessor() {
        return new DummyNodeProcessor();
    }
};
