import { FieldInputProps } from "./graphFieldInputTypes";
import { GraphNode } from "./graphTypes";

export type GraphFieldInputConfig = {
    component: React.ComponentType<FieldInputProps<any>>;
}

export type ResolverParams<Ctx, Params> = {
    context: Ctx;
    parents: { [key: string]: Ctx[] };
    params: Params;
}

export type ResolvableCallback<Ctx, Params, T> = (params: ResolverParams<Ctx, Params>) => T;

export type Resolvable<Ctx, Params, T> = T | ResolvableCallback<Ctx, Params, T>;

export type GraphNodeFieldConfig<Ctx, Params> = {
    label: string;
    type: string;
    initialValue: unknown;
    params?: Resolvable<Ctx, Params, { [key: string]: unknown }>;
}

export type PortTypeMatcher = (portType: string, nodeType: string) => boolean;

export type GraphNodePortOutConfig = {
    type: string;
}

export type GraphNodePortInConfig = {
    type: string | string[];
    match?: PortTypeMatcher;
    multi?: boolean;
}

export type WrappedInputValue = {
    type: string;
    value: unknown;
}

export type CreateProcessorParams<Params> = {
    node: GraphNode;
    params: Params;
}

export type Processor = (inputs: { [key: string]: unknown[] }, next: (portName: string, output: any) => void) => (void | (() => void));

export type MapContextParams<Ctx, Params> = {
    node: GraphNode;
    context: Ctx;
    params: Params;
}

export type GraphNodeConfig<Ctx, Params = {}> = {
    menuGroup: string;
    title: string;
    maxWidth?: number;
    minWidth?: number;
    width?: number;
    fields: {
        [key: string]: GraphNodeFieldConfig<Ctx, Params>;
    };
    ports: {
        in: {
            [key: string]: GraphNodePortInConfig;
        };
        out: {
            [key: string]: GraphNodePortOutConfig;
        };
    };
    mapContext?: (params: MapContextParams<Ctx, Params>) => Ctx;
    createProcessor: (params: CreateProcessorParams<Params>) => Processor;
}

export type PortTypeConfig = {
    color: string;
}

export type ContextMerger<Ctx> = (left: Ctx, right: Ctx) => Ctx;

export type GraphConfig<Ctx, Params = {}> = {
    params?: Params;
    context: Ctx;
    mergeContexts: ContextMerger<Ctx>;
    nodes: {
        [type: string]: GraphNodeConfig<Ctx, Params>;
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
