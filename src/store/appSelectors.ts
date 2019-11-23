import { StoreState } from "./storeTypes";

export function selectSplitSize(state: StoreState): number {
    return state.app.splitSize;
}
