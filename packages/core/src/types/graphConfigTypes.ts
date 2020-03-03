import { InputProps } from "./graphInputTypes";
import { GraphNode } from "./graphTypes";
import { NodeProcessor } from "./nodeProcessorTypes";
import { GraphNodeComponentProps, GraphNodeActions } from "./graphNodeComponentTypes";

export type GraphFieldInputConfig = {
    component: React.ComponentType<InputProps<any>>;
}

export type FieldResolverParams<C, P> = {
    fields: { [key: string]: unknown };
    context: C | undefined;
    params: P;
}

export type ContextResolverParams<C, P> = {
    node: GraphNode;
    contexts: {
        [key: string]: C | undefined;
    };
    params: P;
}

export type MemoizedCallback<P, T, D extends any[] = any> = {
    compute: (...deps: D) => T;
    deps: (param: P) => D;
} | ((param: P) => T);

export type GraphNodeFieldConfig<C, P> = {
    label: string;
    type: string;
    initialValue: unknown;
    fieldGroup?: string;
    params?: { [key: string]: unknown };
    resolveParams?: MemoizedCallback<FieldResolverParams<C, P>, { [key: string]: unknown }>;
}

export type GraphNodePortConfig = {
    type: string | string[] | null;
    label?: string;
    multi?: boolean;
    hidden?: boolean;
}

export type CallbackParams<C, P> = {
    node: GraphNode;
    context: C | undefined;
    params: P;
    actions: GraphNodeActions<C>;
}

export type NodeCreationParams<P> = {
    id: string;
    x: number;
    y: number;
    parent: string | undefined;
    params: P;
    createNodeAt(x: number, y: number, parent: string | undefined, type: string): GraphNode | GraphNode[];
};

export type GraphNodeConfig<C, P = {}> = {
    title: string;
    description: string;
    menuGroup?: string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    width?: number;
    height?: number;
    fields: {
        [key: string]: GraphNodeFieldConfig<C, P>;
    };
    ports: {
        in: {
            [key: string]: GraphNodePortConfig;
        };
        out: {
            [key: string]: GraphNodePortConfig;
        };
    };
    component?: React.ComponentType<GraphNodeComponentProps<C, P>>;
    createNode?: (params: NodeCreationParams<P>) => GraphNode | GraphNode[];
    createProcessor: (node: GraphNode, params: P) => NodeProcessor;
    computeContext?: MemoizedCallback<ContextResolverParams<C, P>, C | undefined>;
    onChanged?: (prev: GraphNode | undefined, next: GraphNode, params: CallbackParams<C, P>) => void;
    onEvent?: (key: string, payload: unknown, params: CallbackParams<C, P>) => void;
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig<C, P> = {
    params?: P;
    computeContext?: MemoizedCallback<ContextResolverParams<C, P>, C | undefined>;
    nodes: {
        [type: string]: GraphNodeConfig<C, P>;
    };
    inputs: {
        [type: string]: GraphFieldInputConfig;
    };
    colors?: {
        ports?: {
            [portType: string]: string | undefined;
        };
    };
}
