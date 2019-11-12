import { GraphFieldInputProps } from "./graphInputTypes";

export type GraphNodeInputSpec = {
    component: React.ComponentType<GraphFieldInputProps>;
}

export type GraphNodeFieldSpec = {
    name: string;
    label: string;
    type: string;
    initialValue?: unknown;
}

export type GraphNodePortSpec = {
    name: string;
    type: string;
}

export type GraphNodePortsSpec = {
    in: GraphNodePortSpec[];
    out: GraphNodePortSpec[];
}

export type GraphNodeMenuEntry = {
    label: string;
    group?: string;
}

export type GraphNodeSpec = {
    menu: GraphNodeMenuEntry;
    title: string;
    fields: GraphNodeFieldSpec[];
    ports: GraphNodePortsSpec;
}

export type GraphSpec = {
    nodes: {
        [type: string]: GraphNodeSpec | undefined;
    };
    inputs: {
        [type: string]: GraphNodeInputSpec | undefined;
    };
}
