import { Resolvable } from "../types/graphSpecTypes";

export function resolve<T>(resolvable: Resolvable<T>, context: unknown): T {
    return typeof resolvable === 'function' ? resolvable(context) : resolvable[0];
}

export function resolveProperty<T>(properties: { [key: string]: unknown }, key: string, valueNotSet: T): T {
    if (properties.hasOwnProperty(key)) {
        return properties[key] as T;
    } else {
        return valueNotSet;
    }
}
