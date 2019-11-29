import { StoreState } from "../types/storeTypes";

export function selectSplitSize(state: StoreState): number {
    return state.app.splitSize;
}
