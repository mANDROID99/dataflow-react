import { TargetPort, MemoizedCallback, ContextResolverParams } from "@react-ngraph/core";
import { mergeDistinct } from "./utils/arrayUtils";
import { ChartContext, ChartParams } from "./types/contextTypes";

export function mergeContexts(left: ChartContext, right: ChartContext): ChartContext {
    const columns = mergeDistinct(left.columns, right.columns);
    let groupColumns: string[] | undefined;

    if (left.groupColumns && right.groupColumns) {
        groupColumns = mergeDistinct(left.groupColumns, right.groupColumns);
    }

    return {
        columns,
        groupColumns
    };
}

export function mergeContextsArray(contexts: ChartContext[]): ChartContext | undefined {
    return contexts.reduce((prev: ChartContext | undefined, next: ChartContext) => prev ? mergeContexts(prev, next) : next);
}

export const COMPUTE_CONTEXT_MERGE_INPUTS: MemoizedCallback<ContextResolverParams<ChartContext, ChartParams>, ChartContext | undefined, ChartContext[]> = {
    compute(_, contexts) {
        return mergeContextsArray(contexts);
    },
    deps({ node, contexts }) {
        const portsIn = node.ports.in;
        const deps: ChartContext[] = [];

        for (const key in portsIn) {
            const portTargets = portsIn[key];

            if (portTargets && portTargets.length) {
                for (const t of portTargets) {
                    const ctx = contexts[t.node];
                    if (ctx) deps.push(ctx);
                }
            }
        }

        return deps;
    }
};

export const COMPUTE_CONTEXT_MERGE_OUTPUTS:  MemoizedCallback<ContextResolverParams<ChartContext, ChartParams>, ChartContext | undefined, ChartContext[]> = {
    compute(_, contexts) {
        return mergeContextsArray(contexts);
    },
    deps({ node, contexts }) {
        const portsOut = node.ports.out;
        const deps: ChartContext[] = [];

        for (const key in portsOut) {
            const portTargets = portsOut[key];

            if (portTargets && portTargets.length) {
                for (const t of portTargets) {
                    const ctx = contexts[t.node];
                    if (ctx) deps.push(ctx);
                }
            }
        }

        return deps;
    }
};
