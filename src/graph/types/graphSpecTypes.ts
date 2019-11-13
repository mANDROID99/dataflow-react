import { GraphFieldInputProps } from "./graphInputTypes";

export type PortMatcher = string | string[] | ((portType: string, nodeType: string) => boolean);

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
    match?: PortMatcher;
}

export type GraphNodePortsSpec = {
    in: GraphNodePortSpec[];
    out: GraphNodePortSpec[];
}

export type GraphNodeSpec = {
    title: string;
    category: string;
    menuOrder?: number;
    fields: GraphNodeFieldSpec[];
    ports: GraphNodePortsSpec;
}

export type PortTypeSpec = {
    color: string;
}

export type NodeCategorySpec = {
    label: string;
    color: string;
    menuOrder?: number;
}

export type GraphSpec = {
    nodes: {
        [type: string]: GraphNodeSpec | undefined;
    };
    inputs: {
        [type: string]: GraphNodeInputSpec | undefined;
    };
    portTypes: {
        [type: string]: PortTypeSpec | undefined;
    };
    categories: {
        [category: string]: NodeCategorySpec | undefined;
    };
}
