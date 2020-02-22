import { InputProps } from "./graphInputTypes";
import { GraphNode } from "./graphTypes";
import { NodeProcessor } from "./processorTypes";
import { NodeActions } from "../editor/components/graphnode/graphNodeActions";

export type GraphFieldInputConfig = {
    component: React.ComponentType<InputProps<any>>;
}

export type FieldResolverParams<Ctx, Params> = {
    fields: { [key: string]: unknown };
    context: Ctx;
    params: Params;
}

export type FieldResolverCallback<Ctx, Params> = (params: FieldResolverParams<Ctx, Params>) => { [key: string]: unknown }

export type FieldResolverConfig<Ctx, Params> = {
    compute: FieldResolverCallback<Ctx, Params>;
    eq?: (prev: FieldResolverParams<Ctx, Params>, next: FieldResolverParams<Ctx, Params>) => boolean;
} | FieldResolverCallback<Ctx, Params>;

export type GraphNodeFieldConfig<Ctx, Params> = {
    label: string;
    type: string;
    initialValue: unknown;
    params?: { [key: string]: unknown };
    resolve?: FieldResolverConfig<Ctx, Params>;
}

export type GraphNodePortConfig = {
    type: string | string[] | null;
    multi?: boolean;
}

export type CallbackParams<Ctx, Params> = {
    node: GraphNode;
    context: Ctx;
    params: Params;
    actions: NodeActions;
}

export enum DragType {
    DRAG_POS,
    DRAG_WIDTH,
    DRAG_SIZE
}

export type GraphNodeComponentProps<Ctx, Params> = {
    nodeId: string;
    node: GraphNode;
    nodeConfig: GraphNodeConfig<Ctx, Params>;
    context: Ctx;
    params: Params;
    actions: NodeActions;
    selected: boolean;
    width: number;
    height: number;
    handleDrag: (event: React.MouseEvent, type: DragType) => void;
}

export type CreateNodeParams<Ctx, Params> = {
    id: string;
    x: number;
    y: number;
    parent: string | undefined;
    params: Params;
    createNodeAt(x: number, y: number, parent: string | undefined, type: string): GraphNode | GraphNode[];
};

export type GraphNodeConfig<Ctx, Params = {}> = {
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
    component?: React.ComponentType<GraphNodeComponentProps<Ctx, Params>>;
    createNode?: (params: CreateNodeParams<Ctx, Params>) => GraphNode | GraphNode[];
    mapContext?: (node: GraphNode, context: Ctx, params: Params) => Ctx;
    createProcessor: (node: GraphNode, params: Params) => NodeProcessor;
    onChanged?: (prev: GraphNode | undefined, next: GraphNode, params: CallbackParams<Ctx, Params>) => void;
    onEvent?: (key: string, payload: unknown, params: CallbackParams<Ctx, Params>) => void;
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
