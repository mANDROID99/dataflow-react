import { GraphFieldInputProps } from "./graphInputTypes";

export type PortMatcher = string | string[] | ((portType: string, nodeType: string) => boolean);

export enum GraphNodeType {
    IN = 'in',
    OUT = 'out',
    TRANSFORM = 'transform'
}

export type GraphNodeInputSpec = {
    component: React.ComponentType<GraphFieldInputProps>;
    initialValue: unknown;
}

export type Resolvable<T> = [T] | ((context: unknown) => T);

export type GraphNodeFieldSpec = {
    name: string;
    label: string;
    type: string;
    initialValue?: Resolvable<unknown>;
    inputParams?: Resolvable<{ [key: string]: unknown }>;
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
    input?: boolean;
    type: GraphNodeType;
    menuGroup: string;
    title: string;
    fields: GraphNodeFieldSpec[];
    ports: GraphNodePortsSpec;
}

export type PortTypeSpec = {
    color: string;
}

export type NodeCategorySpec = {
    label: string;
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
}
