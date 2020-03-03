import { mergeDistinct } from "./utils/arrayUtils";
import { ChartContext } from "./types/contextTypes";

export const BASE_CONTEXT: ChartContext = {
    columns: []
};

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
