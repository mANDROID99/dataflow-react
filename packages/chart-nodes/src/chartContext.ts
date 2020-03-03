import { MemoizedCallback, ContextResolverParams, TargetPorts } from "@react-ngraph/core";
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
    return contexts.reduce<ChartContext | undefined>((prev, next) => prev ? mergeContexts(prev, next) : next, undefined);
}

/**
 * Resolves the contexts for the connected nodes
 */
export function getContextsForPorts(ports: TargetPorts, contexts: { [key: string]: ChartContext | undefined }) {
    const portContexts: ChartContext[] = [];
    for (const key in ports) {
        const portTargets = ports[key];
        if (portTargets && portTargets.length) {
            for (const t of portTargets) {
                const ctx = contexts[t.node];
                if (ctx) portContexts.push(ctx);
            }
        }
    }
    return portContexts;
}

export const COMPUTE_CONTEXT_MERGE_INPUTS: MemoizedCallback<ContextResolverParams<ChartContext, ChartParams>, ChartContext | undefined, ChartContext[]> = {
    compute(...contexts) {
        return mergeContextsArray(contexts);
    },
    deps({ node, contexts }) {
        return getContextsForPorts(node.ports.in, contexts);
    }
};
