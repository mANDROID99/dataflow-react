import { Resolvable } from "../types/graphConfigTypes";

export function resolve<T, P>(resolvable: Resolvable<T, P>, params: P): T {
    if (typeof resolvable === 'function') {
        return (resolvable as (param: P) => T)(params);
    } else {
        return resolvable;
    }
}
