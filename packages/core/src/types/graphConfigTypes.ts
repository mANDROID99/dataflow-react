import { InputProps } from "./graphInputTypes";
import { GraphNode } from "./graphTypes";
import { NodeProcessor } from "./nodeProcessorTypes";
import { GraphNodeComponentProps, GraphNodeActions } from "./graphNodeComponentTypes";

export type GraphFieldInputConfig = {
    component: React.ComponentType<InputProps<any>>;
}

export type FieldResolverParams<C, P> = {
    fields: { [key: string]: unknown };
    context: C;
    params: P;
}

export type FieldResolverCallback<C, P> = (params: FieldResolverParams<C, P>) => { [key: string]: unknown }

export type FieldResolverConfig<C, P> = {
    compute: FieldResolverCallback<C, P>;
    eq?: (prev: FieldResolverParams<C, P>, next: FieldResolverParams<C, P>) => boolean;
} | FieldResolverCallback<C, P>;

export type GraphNodeFieldConfig<C, P> = {
    label: string;
    type: string;
    initialValue: unknown;
    params?: { [key: string]: unknown };
    resolve?: FieldResolverConfig<C, P>;
}

export type GraphNodePortConfig = {
    type: string | string[] | null;
    multi?: boolean;
    hidden?: boolean;
}

export type CallbackParams<C, P> = {
    node: GraphNode;
    context: C;
    params: P;
    actions: GraphNodeActions;
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
    mapContext?: (node: GraphNode, context: C, params: P) => C;
    onChanged?: (prev: GraphNode | undefined, next: GraphNode, params: CallbackParams<C, P>) => void;
    onEvent?: (key: string, payload: unknown, params: CallbackParams<C, P>) => void;
}

export type PortTypeConfig = {
    color: string;
}

export type ContextMerger<C> = (left: C, right: C) => C;

export type GraphConfig<C, P> = {
    params?: P;
    context: C;
    mergeContexts: ContextMerger<C>;
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
