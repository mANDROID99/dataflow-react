import { Resolvable, ResolvableCallback } from "../../types/graphConfigTypes";
import { GraphNodeContext } from "../../types/graphFieldInputTypes";

export function resolve<Ctx, Params, T>(resolvable: Resolvable<Ctx, Params, T>, context: GraphNodeContext<Ctx, Params>): T {
    return typeof resolvable === 'function'
        ? (resolvable as ResolvableCallback<Ctx, Params, T>)(context)
        : resolvable;
}

