import { Resolvable } from "../../types/graphConfigTypes";

export function resolve<T>(resolvable: Resolvable<T>, context: unknown): T {
    return typeof resolvable === 'function' ? (resolvable as ((context: unknown) => T))(context) : resolvable;
}

export function resolveProperty<T>(properties: { [key: string]: unknown }, key: string, valueNotSet: T): T {
    if (properties.hasOwnProperty(key)) {
        return properties[key] as T;
    } else {
        return valueNotSet;
    }
}
