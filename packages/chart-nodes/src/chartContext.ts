import { mergeDistinct } from "./utils/arrayUtils";
import { ViewConfig } from './types/valueTypes';

export type ChartContext = {
    columns: string[];
    groupColumns?: string[];
}

export type ChartParams = {
    renderView?(viewId: string, viewConfig: ViewConfig): void;
    variables: {
        [key: string]: unknown;
    }
}

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