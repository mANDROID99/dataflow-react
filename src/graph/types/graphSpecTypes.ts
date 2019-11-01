export type GraphFieldInputSpec<T> = {
    // component: React.ComponentType<GraphFieldInputProps<T>>
}

export type GraphNodeFieldSpec = {
    name: string;
    label: string;
    type: string;
}

export type GraphNodePortSpec = {
    name: string;
    type: string;
}

export type GraphNodePortsSpec = {
    in: GraphNodePortSpec[];
    out: GraphNodePortSpec[];
}

export type GraphNodeSpec = {
    width: number;
    title: string;
    fields: GraphNodeFieldSpec[];
    ports: GraphNodePortsSpec;
}

export type GraphSpec = {
    nodes: {
        [type: string]: GraphNodeSpec;
    };
    inputs: {
        [type: string]: GraphFieldInputSpec<any>;
    };
}
