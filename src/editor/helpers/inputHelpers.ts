import { Resolvable } from "../../types/graphConfigTypes";

export function resolve<Context, T>(resolvable: Resolvable<Context, T>, context: unknown): T {
    return typeof resolvable === 'function' ? (resolvable as ((context: unknown) => T))(context) : resolvable;
}

export function resolveProperty<T>(properties: { [key: string]: unknown }, key: string, valueNotSet: T): T {
    // eslint-disable-next-line
    if (properties.hasOwnProperty(key)) {
        return properties[key] as T;
    } else {
        return valueNotSet;
    }
}
