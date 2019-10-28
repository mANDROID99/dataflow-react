import { GraphFieldInputProps } from "./graphInputTypes"

export type GraphFieldInputSpec<T> = {
    component: React.ComponentType<GraphFieldInputProps<T>>
}

export type GraphNodeFieldSpec = {
    name: string;
    label: string;
    type: string;
}

export type GraphNodePortSpec = {
    name: string;
    label: string;
    type: string;
}

export type GraphNodeSpec = {
    fields: GraphNodeFieldSpec[];
    portsIn: GraphNodePortSpec[];
    portsOut: GraphNodePortSpec[];
}

export type GraphSpec = {
    nodes: {
        [id: string]: GraphNodeSpec;
    };
    inputs: {
        [id: string]: GraphFieldInputSpec<any>;
    };
}
