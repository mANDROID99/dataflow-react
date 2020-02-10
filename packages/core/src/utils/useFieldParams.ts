import { useRef } from "react";
import { GraphNodeFieldConfig, FieldResolverParams } from "../types/graphConfigTypes";

type ResolverState<Ctx, Params> = {
    resolverParams: FieldResolverParams<Ctx, Params>;
    params: { [key: string]: unknown };
}

function compareShallow(prev: { [key: string]: unknown }, next: { [key: string]: unknown }) {
    for (const key in next) {
        if (prev[key] !== next[key]) {
            return false;
        }
    }
    return true;
}

function resolveInitialState<Ctx, Params>(fieldConfig: GraphNodeFieldConfig<Ctx, Params>, resolverParams: FieldResolverParams<Ctx, Params>): ResolverState<Ctx, Params> {
    let params = fieldConfig.params;
    const resolve = fieldConfig.resolve;

    if (resolve) {
        let p: { [key: string]: unknown };

        if (typeof resolve === 'function') {
            p = resolve(resolverParams);
            
        } else {
            p = resolve.compute(resolverParams);
        }

        if (params) {
            params = Object.assign({}, params, p);
            
        } else {
            params = p;
        }
    }

    return {
        resolverParams,
        params: params || {}
    };
}

export function useFieldParams<Ctx, Params>(fieldConfig: GraphNodeFieldConfig<Ctx, Params>, resolverParams: FieldResolverParams<Ctx, Params>): { [key: string]: unknown } {
    const prev = useRef<ResolverState<Ctx, Params>>();
    
    if (!prev.current) {
        prev.current = resolveInitialState(fieldConfig, resolverParams);
    }

    if (prev.current.resolverParams !== resolverParams) {        
        const resolve = fieldConfig.resolve;
        
        if (resolve) {
            if (typeof resolve === 'function') {
                const nextParams = resolve(resolverParams);
                if (!compareShallow(prev.current.params, nextParams)) {
                    prev.current.params = Object.assign({}, prev.current.params, nextParams);
                }

            } else if (!(resolve.eq && resolve.eq(prev.current.resolverParams, resolverParams))) {
                const nextParams = resolve.compute(resolverParams);
                if (!compareShallow(prev.current.params, nextParams)) {
                    prev.current.params = Object.assign({}, prev.current.params, nextParams);
                }
            }
        }

        prev.current.resolverParams = resolverParams;
    }

    return prev.current.params;
}
