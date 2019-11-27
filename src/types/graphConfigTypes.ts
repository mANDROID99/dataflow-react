import { GraphFieldInputProps } from "./graphInputTypes";

export interface Observable<T> {
    subscribe(fn: (value: T) => void): void;

    unsubscribe(fn: (value: T) => void): void;
}

export enum GraphNodeRole {
    INPUT = 'in',
    OUTPUT = 'out'
}

export type GraphNodeInputConfig = {
    component: React.ComponentType<GraphFieldInputProps>;
    initialValue: unknown;
}

export type Resolvable<T> = [T] | ((context: unknown) => T);

export type GraphNodeFieldConfig = {
    name: string;
    label: string;
    type: string;
    initialValue?: Resolvable<unknown>;
    inputParams?: Resolvable<{ [key: string]: unknown }>;
}

export type GraphNodePortConfig = {
    name: string;
    type: string | string[];
}

export type GraphNodePortsConfig = {
    in: GraphNodePortConfig[];
    out: GraphNodePortConfig[];
}

export type GraphNodeConfig = {
    role?: GraphNodeRole;
    menuGroup: string;
    title: string;
    fields: GraphNodeFieldConfig[];
    ports: GraphNodePortsConfig;
    run?: (input: any, next: (value: any) => void) => void; 
}

export type PortTypeConfig = {
    color: string;
}

export type GraphConfig = {
    nodes: {
        [type: string]: GraphNodeConfig | undefined;
    };
    inputs: {
        [type: string]: GraphNodeInputConfig | undefined;
    };
    portTypes: {
        [type: string]: PortTypeConfig | undefined;
    };
}
