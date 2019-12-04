import { GraphNode } from "./graphTypes";

export type GraphFieldEditorProps<Context, T> = {
    value: T;
    onChanged: (value: T) => void;
    field: GraphNodeFieldConfig<Context>;
    context: Context;
}

export type GraphNodeEditorConfig<Ctx, T> = {
    height?: number;
    component: React.ComponentType<GraphFieldEditorProps<Ctx, T>>;
}

export type Resolvable<Ctx, T> = T | ((context: Ctx) => T);

export type GraphNodeFieldConfig<Ctx> = {
    label: string;
    editor: string;
    initialValue: Resolvable<Ctx, unknown>;
    inputParams?: Resolvable<Ctx, { [key: string]: unknown }>;
}

export type PortTypeMatcher = string | string[] | ((portType: string, nodeType: string) => boolean);

export type GraphNodePortOutConfig = {
    label: string;
    type: string;
}

export type GraphNodePortInConfig = {
    label: string;
    match: PortTypeMatcher;
    initialValue: unknown;
}

export type ProcessFn = (
    input: { [key: string]: unknown },
    next: (portName: string, output: unknown) => void
) => (void | (() => void));

export type ProcessCallbackOptions<Ctx> = {
    node: GraphNode;
    context: Ctx;
}

export type ModifyContextCallbackOptions<Ctx> = {
    node: GraphNode;
    context: Ctx;
}

export type GraphNodeConfig<Ctx> = {
    menuGroup: string;
    title: string;
    isOutput?: boolean;
    width?: number;
    fields: {
        [key: string]: GraphNodeFieldConfig<Ctx>;
    };
    ports: {
        in: {
            [key: string]: GraphNodePortInConfig;
        };
        out: {
            [key: string]: GraphNodePortOutConfig;
        };
    };
    process: (options: ProcessCallbackOptions<Ctx>) => ProcessFn;
    modifyContext?: (options: ModifyContextCallbackOptions<Ctx>) => void;
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig<Ctx> = {
    mergeContexts: (left: Ctx, right: Ctx) => Ctx;
    nodes: {
        [type: string]: GraphNodeConfig<Ctx>;
    };
    editors: {
        [type: string]: GraphNodeEditorConfig<Ctx, any>;
    };
    colors?: {
        ports?: {
            [portType: string]: string;
        };
    };
}
