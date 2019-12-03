
export type BaseContext = {
    properties: string[];
}

export type ChartContext = {
    columns: string[];
    keys: string[];
    base: BaseContext;
}

export function mergeContexts(left: ChartContext, right: ChartContext) {
    const columns = left.columns.concat(right.columns);
    const keys = left.keys.concat(right.keys);
    const base = right.base;
    return { columns, keys, base };
}
