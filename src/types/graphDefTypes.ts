import { NodeProcessor } from './processorTypes';

export type ComponentProps<Params, C> = {
    config: C;
    params: Params;
}

export type Bounds = {
    x: number;
    y: number;
    width: number;
    height: number;
}

export type ContentComponentProps<Params, C> = ComponentProps<Params, C> & {
    bounds: Bounds;
}

export type ConfigComponentProps<Params, Ctx, C> = ComponentProps<Params, C> & {
    context: Ctx;
    onChanged: (config: C) => void;
};

export type GetContextCallbackParams<C, Params, Ctx> = {
    config: C;
    params: Params;
    parents: { [key: string]: Ctx | undefined };
}

export enum PortAlign {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right'
};

export type PortDef = {
    type: string | string[] | null;
    label?: string;
    align?: PortAlign;
}

export type NodeDims = {
    padH: number;
    padV: number;
    width: number;
    height: number;
}

export type NodeDef<Params = unknown, Ctx = unknown, C = unknown> = {
    name: string;
    initialConfig: C;
    ports: {
        in: {
            [key: string]: PortDef;
        };
        out: {
            [key: string]: PortDef;
        }
    };
    dims?: Partial<NodeDims>;
    renderContent: (props: ContentComponentProps<Params, C>) => React.ReactNode;
    renderConfig: (props: ConfigComponentProps<Params, Ctx, C>) => React.ReactNode;
    processor( config: C, params: Params): NodeProcessor<Ctx>;
}

export type Dims = {
    node?: Partial<NodeDims>;
}

export type GraphDef<Params = unknown, Ctx = unknown> = {
    nodes: {
        [type: string]: NodeDef<Params, Ctx, any> | undefined;
    };
    dims?: Dims;
}
