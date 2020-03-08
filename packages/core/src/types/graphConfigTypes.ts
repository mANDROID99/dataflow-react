import { InputProps } from "./graphInputTypes";
import { GraphNode } from "./graphTypes";
import { NodeProcessor } from "./nodeProcessorTypes";
import { GraphNodeComponentProps, GraphNodeActions } from "./graphNodeComponentTypes";

export type GraphFieldInputConfig = {
    component: React.ComponentType<InputProps<any>>;
}

export type FieldResolverParams<C, P> = {
    context: C;
    params: P;
    fields: {
        [key: string]: unknown;
    };
}

export type MapContextParams<C, P> = {
    node: GraphNode;
    context: C;
    params: P;
}

export type Resolvable<T, P> = T | ((params: P) => T);

export type GraphNodeSubFieldConfig<C, P> = {
    label: string;
    type: string;
    initialValue: unknown;
    lockOrder?: boolean;
    style?: React.CSSProperties;
    params?: Resolvable<{ [key: string]: unknown }, FieldResolverParams<C, P>>;
}

export type GraphNodeFieldConfig<C, P> = {
    label: string;
    type: string;
    initialValue: unknown;
    description?: string;
    fieldGroup?: string;
    renderWhenAnyFieldChanged?: boolean;
    params?: Resolvable<{ [key: string]: unknown }, FieldResolverParams<C, P>>;
    subFields?: {
        [key: string]: GraphNodeSubFieldConfig<C, P>;
    };
}

export type GraphNodePortConfig = {
    type: string | string[] | null;
    label?: string;
    multi?: boolean;
    hidden?: boolean;
    proxy?: string;
}

export type CallbackParams<C, P> = {
    node: GraphNode;
    context: C | undefined;
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
    mapContext?: (params: MapContextParams<C, P>) => C;
    onChanged?: (prev: GraphNode | undefined, next: GraphNode, params: CallbackParams<C, P>) => void;
    onEvent?: (key: string, payload: unknown, params: CallbackParams<C, P>) => void;
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig<C, P> = {
    params?: P;
    context: C;
    mergeContexts?: (left: C, right: C) => C;
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
