import { GraphNode } from "./graphTypes";
import { NodeProcessor } from "./processorTypes";
import { GraphFieldInputConfig, ComputedNode } from "./graphInputTypes";

export type ResolverParams<Ctx, Params> = {
    node: GraphNode;
    context: Ctx;
    params: Params;
    parents: { [key: string]: ComputedNode<Ctx>[] };
}

export type GraphNodeFieldConfig<Ctx, Params> = {
    label: string;
    type: string;
    initialValue?: unknown;
    params?: { [key: string]: unknown } | ((params: ResolverParams<Ctx, Params>) => { [key: string]: unknown });
}

export type GraphNodePortConfig = {
    type: string | string[];
    multi?: boolean;
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
    createProcessor: (fields: { [key: string]: unknown }, params: ResolverParams<Ctx, Params>) => NodeProcessor;
    mapContext?: (fields: { [key: string]: unknown }, params: ResolverParams<Ctx, Params>) => Ctx;
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
