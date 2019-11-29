import { GraphFieldEditorProps } from "./graphEditorTypes";

export interface Observable<T> {
    subscribe(fn: (value: T) => void): void;

    unsubscribe(fn: (value: T) => void): void;
}

export type GraphNodeEditorConfig<T> = {
    component: React.ComponentType<GraphFieldEditorProps<T>>;
}

export type Resolvable<T> = T | ((context: unknown) => T);

export type GraphNodeFieldConfig = {
    label: string;
    editor: string;
    initialValue: Resolvable<unknown>;
    inputParams?: Resolvable<{ [key: string]: unknown }>;
}

export type PortTypeMatcher = string | string[] | ((portType: string, nodeType: string) => boolean);

export type GraphNodePortOutConfig = {
    type: string;
}

export type GraphNodePortInConfig = {
    match: PortTypeMatcher;
    initialValue: unknown;
}

export type ProcessFn = (
    input: { [key: string]: unknown },
    next: (portName: string, output: unknown) => void
) => (void | (() => void));

export type GraphNodeConfig = {
    menuGroup: string;
    title: string;
    isOutput?: boolean;
    autoStart?: boolean;
    fields: {
        [key: string]: GraphNodeFieldConfig;
    }
    ports: {
        in: {
            [key: string]: GraphNodePortInConfig;
        },
        out: {
            [key: string]: GraphNodePortOutConfig;
        }
    }
    process: (config: { [key: string]: unknown }) => ProcessFn;
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig = {
    nodes: {
        [type: string]: GraphNodeConfig;
    };
    editors: {
        [type: string]: GraphNodeEditorConfig<any>;
    };
    colors?: {
        ports?: {
            [portType: string]: string;
        }
    }
}
