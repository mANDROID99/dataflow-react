import produce from "immer";
import { AppState } from "../types/storeTypes";
import { AppAction, ActionType, ResizePaneAction } from "./appActions";

const INITIAL_STATE: AppState = {
    splitSize: 300
};

const handleResizePane = produce((state: AppState, action: ResizePaneAction) => {
    state.splitSize = action.newSize;
});

export default function appReducer(state: AppState = INITIAL_STATE, action: AppAction): AppState {
    switch (action.type) {
        case ActionType.RESIZE_SPLIT_PANE:
            return handleResizePane(state, action);
        default:
            return state;
    }
}

