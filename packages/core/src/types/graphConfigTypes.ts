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

export type GraphNodePortConfig = {
    type: string | string[];
    multi?: boolean;
}

export type ContextMapperParams<Ctx, Params> = {
    node: GraphNode;
    context: Ctx;
    params: Params;
}

export type ProcessorCreationParams<Params> = {
    node: GraphNode;
    params: Params;
    next: (portName: string, value: unknown) => void;
}

export interface Processor {
    onStart?(): void;
    onStop?(): void;
    onNext?(inputs: { [key: string]: unknown[] }): void;
}

export type GraphNodeConfig<Ctx, Params = {}> = {
    menuGroup: string;
    title: string;
    description: string;
    maxWidth?: number;
    minWidth?: number;
    width?: number;
    fields: {
        [key: string]: GraphNodeFieldConfig<Ctx, Params>;
    };
    ports: {
        in: {
            [key: string]: GraphNodePortConfig;
        };
        out: {
            [key: string]: GraphNodePortConfig;
        };
    };
    mapContext?: (params: ContextMapperParams<Ctx, Params>) => Ctx;
    createProcessor: (params: ProcessorCreationParams<Params>) => Processor;
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
