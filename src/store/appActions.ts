
export enum ActionType {
    RESIZE_SPLIT_PANE = 'app.RESIZE_PANE'
}

export function resizeSplitPane(newSize: number): ResizePaneAction {
    return {
        type: ActionType.RESIZE_SPLIT_PANE,
        newSize
    };
}

export type ResizePaneAction = {
    type: ActionType.RESIZE_SPLIT_PANE;
    newSize: number;
}

export type AppAction = ResizePaneAction;
