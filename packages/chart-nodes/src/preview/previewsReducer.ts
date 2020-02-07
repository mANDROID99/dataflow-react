import { ViewConfig } from "../types/valueTypes";

type PreviewsState = {
    previewId: string | undefined;
    previews: {
        [viewId: string]: ViewConfig;
    }
}

enum ActionType {
    RESET,
    UPDATE_PREVIEW,
    SET_ACTIVE_PREVIEW
}

type ResetAction = {
    type: ActionType.RESET;    
};

type UpdatePreviewAction = {
    type: ActionType.UPDATE_PREVIEW;
    previewId: string;
    config: ViewConfig;
};

type SetActivePreviewAction = {
    type: ActionType.SET_ACTIVE_PREVIEW;
    previewId: string;
}

type Action = ResetAction | UpdatePreviewAction | SetActivePreviewAction;

function handleReset(): PreviewsState {
    return {
        previewId: undefined,
        previews: {}
    };
}

function handleUpdatePreview(state: PreviewsState, action: UpdatePreviewAction): PreviewsState {
    const previews = Object.assign({}, state.previews);
    previews[action.previewId] = action.config;

    return {
        // switch to the updated preview
        previewId: action.previewId,
        previews
    };
}

function handleSetActivePreview(state: PreviewsState, action: SetActivePreviewAction): PreviewsState {
    return {
        previewId: action.previewId,
        previews: state.previews
    };
}

export function init(): PreviewsState {
    return {
        previewId: undefined,
        previews: {}
    };
}

export function previewsReducer(state: PreviewsState, action: Action): PreviewsState {
    switch (action.type) {
        case ActionType.RESET:
            return handleReset();

        case ActionType.UPDATE_PREVIEW:
            return handleUpdatePreview(state, action);

        case ActionType.SET_ACTIVE_PREVIEW:
            return handleSetActivePreview(state, action);

        default:
            return state;
    }
}

export function reset(): ResetAction {
    return { type: ActionType.RESET };
}

export function updatePreview(previewId: string, config: ViewConfig): UpdatePreviewAction {
    return { type: ActionType.UPDATE_PREVIEW, previewId, config };
}

export function setActivePreview(previewId: string): SetActivePreviewAction {
    return { type: ActionType.SET_ACTIVE_PREVIEW, previewId };
}
