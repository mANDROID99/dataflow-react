import { GraphFieldEditorProps } from "./graphEditorTypes";
import { GraphNodeProcessor } from "../nodes/nodeDataTypes";

export interface Observable<T> {
    subscribe(fn: (value: T) => void): void;

    unsubscribe(fn: (value: T) => void): void;
}

export enum GraphNodeRole {
    INPUT = 'in',
    OUTPUT = 'out'
}

export type GraphNodeEditorConfig<T> = {
    component: React.ComponentType<GraphFieldEditorProps<T>>;
}

export type Resolvable<T> = T | ((context: unknown) => T);

export type GraphNodeFieldConfig<T> = {
    label: string;
    editor: string;
    initialValue: Resolvable<T>;
    inputParams?: Resolvable<{ [key: string]: unknown }>;
}

export type PortTypeMatcher = string | string[] | ((portType: string, nodeType: string) => boolean);

export type GraphNodePortOutConfig<T> = {
    type: string;
}

export type GraphNodePortInConfig<T> = {
    match: PortTypeMatcher;
    initialValue: T;
}

export type GraphNodeConfig<In, Out, Config> = {
    role?: GraphNodeRole;
    menuGroup: string;
    title: string;
    fields: {
        [K in keyof Config]: GraphNodeFieldConfig<Config[K]>;
    }
    ports: {
        in: {
            [K in keyof In]: GraphNodePortInConfig<In[K]>;
        },
        out: {
            [K in keyof Out]: GraphNodePortOutConfig<Out[K]>;
        }
    }
    createProcessor: (config: Config) => GraphNodeProcessor<In, Out>;
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig = {
    nodes: {
        [type: string]: GraphNodeConfig<any, any, any> | undefined;
    };
    editors: {
        [type: string]: GraphNodeEditorConfig<any> | undefined;
    };
    colors?: {
        ports?: {
            [portType: string]: string;
        }
    }
}
