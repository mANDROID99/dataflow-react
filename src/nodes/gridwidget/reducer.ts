import { produce } from 'immer';
import { GridViewColumnConfig, Config } from "./gridWidgetNodeDef";

export enum ActionType {
    SET_WIDGET_NAME,
    ADD_COLUMN,
    REMOVE_COLUMN,
    MOVE_COLUMN,
    SET_COLUMN_LABEL,
    SET_COLUMN_KEY,
    SET_COLUMN_WIDTH
}

export type Action =
    | { type: ActionType.SET_WIDGET_NAME, name: string }
    | { type: ActionType.ADD_COLUMN }
    | { type: ActionType.REMOVE_COLUMN, col: number }
    | { type: ActionType.MOVE_COLUMN, col: number, offset: number }
    | { type: ActionType.SET_COLUMN_LABEL, col: number, label: string }
    | { type: ActionType.SET_COLUMN_KEY, col: number, key: string }
    | { type: ActionType.SET_COLUMN_WIDTH, col: number, width: number }
    ;

type ExtractAction<T extends ActionType, A extends Action = Action> = A extends { type: T } ? A : never;

function createColumn(): GridViewColumnConfig {
    return {
        key: '',
        label: '',
        width: 100,
        format: {
            format: {},
            conditions: []
        }
    };
}

const handleSetWidgetName = produce((config: Config, action: ExtractAction<ActionType.SET_WIDGET_NAME>) => {
    config.widgetName = action.name;
});

const handleAddColumn = produce((config: Config) => {
    config.columns.push(createColumn());
});

const handleRemoveColumn = produce((config: Config, action: ExtractAction<ActionType.REMOVE_COLUMN>) => {
    config.columns.splice(action.col, 1);
});

const handleMoveColumn = produce((config: Config, action: ExtractAction<ActionType.MOVE_COLUMN>) => {
    const columns = config.columns;
    const c = columns[action.col];
    if (action.offset < 0) {
        columns[action.col] = columns[action.col - 1];
        columns[action.col - 1] = c;
    } else {
        columns[action.col] = columns[action.col + 1];
        columns[action.col + 1] = c;
    }
});

const handleSetColumnLabel = produce((config: Config, action: ExtractAction<ActionType.SET_COLUMN_LABEL>) => {
    config.columns[action.col].label = action.label;
});

const handleSetColumnKey = produce((config: Config, action: ExtractAction<ActionType.SET_COLUMN_KEY>) => {
    config.columns[action.col].key = action.key;
});

const handleSetColumnWidth = produce((config: Config, action: ExtractAction<ActionType.SET_COLUMN_WIDTH>) => {
    config.columns[action.col].width = action.width;
});

export function reducer(config: Config, action: Action): Config {
    switch(action.type) {
        case ActionType.SET_WIDGET_NAME:
            return handleSetWidgetName(config, action);
        case ActionType.ADD_COLUMN:
            return handleAddColumn(config);
        case ActionType.REMOVE_COLUMN:
            return handleRemoveColumn(config, action);
        case ActionType.MOVE_COLUMN:
            return handleMoveColumn(config, action);
        case ActionType.SET_COLUMN_LABEL:
            return handleSetColumnLabel(config, action);
        case ActionType.SET_COLUMN_KEY:
            return handleSetColumnKey(config, action);
        case ActionType.SET_COLUMN_WIDTH:
            return handleSetColumnWidth(config, action)
        default:
            return config;
    }
}
