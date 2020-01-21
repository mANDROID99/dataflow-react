import { GraphConfig } from "./graphConfigTypes";

export type FormProps<T> = {
    value: T;
    params: unknown;
    onSubmit: (value: T) => void;
    onHide: () => void;
    graphConfig: GraphConfig<unknown, unknown>;
}

export type FormConfig<T> = {
    component: React.ComponentType<FormProps<T>>;
}

export type FormConfigs = {
    [formType: string]: FormConfig<any> | undefined;
};
