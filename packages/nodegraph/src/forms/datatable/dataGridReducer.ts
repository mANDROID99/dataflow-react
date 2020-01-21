import produce from "immer";

export enum ActionType {
    RESIZE_COLUMN,
    CHANGE_CELL_VALUE,
    CHANGE_COLUMN_HEADER,
    DELETE_SELECTED_ROWS,
    INSERT_ROW_BEFORE_SELECTED,
    INSERT_ROW_AFTER_SELECTED,
    EDIT_COLUMN_NAME,
    DELETE_COLUMN,
    INSERT_COLUMN_BEFORE,
    INSERT_COLUMN_AFTER,
    SET_NUM_ROWS,
    SET_NUM_COLS,
    TOGGLE_ROW_SELECTION,
    TOGGLE_SELECT_ALL_ROWS,
    SHOW_CONTEXT_MENU,
    HIDE_CONTEXT_MENU
}

export type ResizeColumnAction = { type: ActionType.RESIZE_COLUMN; col: number; width: number };
export type ChangeCellValueAction = { type: ActionType.CHANGE_CELL_VALUE; col: number; row: number; value: string };
export type ChangeColumnHeaderAction = { type: ActionType.CHANGE_COLUMN_HEADER; col: number; value: string };
export type DeleteSelectedRowsAction =  { type: ActionType.DELETE_SELECTED_ROWS };
export type InsertRowBeforeSelectedAction = { type: ActionType.INSERT_ROW_BEFORE_SELECTED };
export type InsertRowAfterSelectedAction = { type: ActionType.INSERT_ROW_AFTER_SELECTED };
export type EditColumnNameAction = { type: ActionType.EDIT_COLUMN_NAME; col: number };
export type DeleteColumnAction = { type: ActionType.DELETE_COLUMN; col: number };
export type InsertColumnBeforeAction = { type: ActionType.INSERT_COLUMN_BEFORE; col: number };
export type InsertColumnAfterAction = { type: ActionType.INSERT_COLUMN_AFTER; col: number };
export type ToggleRowSelectionAction = { type: ActionType.TOGGLE_ROW_SELECTION; row: number };
export type ToggleSelectAllAction = { type: ActionType.TOGGLE_SELECT_ALL_ROWS; selected: boolean };
export type ShowContextMenuAction = { type: ActionType.SHOW_CONTEXT_MENU; x: number; y: number };
export type HideContextMenuAction = { type: ActionType.HIDE_CONTEXT_MENU };

export type Action =
    | ResizeColumnAction
    | ChangeCellValueAction
    | ChangeColumnHeaderAction
    | DeleteSelectedRowsAction
    | InsertRowBeforeSelectedAction
    | InsertRowAfterSelectedAction
    | EditColumnNameAction
    | DeleteColumnAction
    | InsertColumnBeforeAction
    | InsertColumnAfterAction
    | ToggleRowSelectionAction
    | ToggleSelectAllAction
    | ShowContextMenuAction
    | HideContextMenuAction
    ;

export type ColumnState = {
    name: string;
    width: number;
    editing: boolean;
}

export type RowState = {
    values: string[];
    selected: boolean;
}

export type ContextMenuState = {
    show: boolean;
    x: number;
    y: number;
}

export type State = {
    originalColumns: string[];
    originalRows: string[][];
    columns: ColumnState[];
    rows: RowState[];
    contextMenu: ContextMenuState;
}

export type InitParams = {
    columns: string[];
    rows: string[][];
}

export function init(params: InitParams): State {
    const columnNames = params.columns;
    const rowValues = params.rows;

    const rows = rowValues.map((values): RowState => ({
        values,
        selected: false
    }));

    const columns = columnNames.map((name): ColumnState => ({
        name,
        width: 100,
        editing: false
    }));

    return {
        originalColumns: columnNames,
        originalRows: rowValues,
        columns,
        rows,
        contextMenu: {
            x: 0,
            y: 0,
            show: false
        }
    };
}

function createColumn(): ColumnState {
    return {
        name: '',
        width: 100,
        editing: true
    };
}

function createRow(numCols: number): RowState {
    const values: string[] = new Array(numCols);
    values.fill('');

    return {
        values,
        selected: false
    };
}

const handleResizeColumn = produce((state: State, action: ResizeColumnAction) => {
    const column = state.columns[action.col];
    if (column) {
        column.width = action.width;
    } 
});

const handleChangeCellValue = produce((state: State, action: ChangeCellValueAction) => {
    const row = state.rows[action.row];
    if (row) {
        row.values[action.col] = action.value;
    }
});

const handleChangeColumnHeader = produce((state: State, action: ChangeColumnHeaderAction) => {
    const col = state.columns[action.col];
    if (col) {
        col.name = action.value;
        col.editing = false;
    }
});

const handleDeleteSelectedRows = produce((state: State) => {
    const rows = state.rows.flatMap(row => {
        if (row.selected) {
            return [];
        } else {
            return [row];
        }
    });
    if (rows.length === 0) {
        rows.push(createRow(state.columns.length));
    }
    state.rows = rows;
    state.contextMenu.show = false;
});

const handleInsertRowBeforeSelected = produce((state: State) => {
    const newRow = createRow(state.columns.length);
    const rows = state.rows.flatMap(row => {
        if (row.selected) {
            return [newRow, row];
        } else {
            return [row];
        }
    });
    state.rows = rows;
    state.contextMenu.show = false;
});

const handleInsertRowAfterSelected = produce((state: State) => {
    const newRow = createRow(state.columns.length);
    const rows = state.rows.flatMap(row => {
        if (row.selected) {
            return [row, newRow];
        } else {
            return [row];
        }
    });
    state.rows = rows;
    state.contextMenu.show = false;
});

const handleEditColumnName = produce((state: State, action: EditColumnNameAction) => {
    const column = state.columns[action.col];
    if (column) {
        column.editing = true;
    }
});

const handleDeleteColumn = produce((state: State, action: DeleteColumnAction) => {
    state.columns.splice(action.col, 1);
    for (const row of state.rows) {
        row.values.splice(action.col, 1);
    }

    if (state.columns.length === 0) {
        state.columns.push(createColumn());
        for (const row of state.rows) {
            row.values.push('');
        }
    }
});

const handleInsertColumnAfter = produce((state: State, action: InsertColumnAfterAction) => {
    const newColumn = createColumn();
    state.columns.splice(action.col + 1, 0, newColumn);
    for (const row of state.rows) {
        row.values.splice(action.col + 1, 0, '');
    }
});

const handleInsertColumnBefore = produce((state: State, action: InsertColumnBeforeAction) => {
    const newColumn = createColumn();
    state.columns.splice(action.col, 0, newColumn);
    for (const row of state.rows) {
        row.values.splice(action.col, 0, '');
    }
});

const handleToggleRowSelection = produce((state: State, action: ToggleRowSelectionAction) => {
    const row = state.rows[action.row];
    if (row) {
        row.selected = !row.selected;
    }
});

const handleToggleSelectAll = produce((state: State, action: ToggleSelectAllAction) => {
    for (const row of state.rows) {
        row.selected = action.selected;
    }
});

const handleShowContextMenu = produce((state: State, action: ShowContextMenuAction) => {
    state.contextMenu = {
        show: true,
        x: action.x,
        y: action.y
    };
});

const handleHideContextMenu = produce((state: State) => {
    state.contextMenu.show = false;
});

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.RESIZE_COLUMN:
            return handleResizeColumn(state, action);

        case ActionType.CHANGE_CELL_VALUE:
            return handleChangeCellValue(state, action);

        case ActionType.CHANGE_COLUMN_HEADER:
            return handleChangeColumnHeader(state, action);

        case ActionType.DELETE_SELECTED_ROWS:
            return handleDeleteSelectedRows(state);

        case ActionType.INSERT_ROW_BEFORE_SELECTED:
            return handleInsertRowBeforeSelected(state);
    
        case ActionType.INSERT_ROW_AFTER_SELECTED:
            return handleInsertRowAfterSelected(state);

        case ActionType.EDIT_COLUMN_NAME:
            return handleEditColumnName(state, action);

        case ActionType.DELETE_COLUMN:
            return handleDeleteColumn(state, action);

        case ActionType.INSERT_COLUMN_AFTER:
            return handleInsertColumnAfter(state, action);

        case ActionType.INSERT_COLUMN_BEFORE:
            return handleInsertColumnBefore(state, action);

        case ActionType.TOGGLE_ROW_SELECTION:
            return handleToggleRowSelection(state, action);

        case ActionType.TOGGLE_SELECT_ALL_ROWS:
            return handleToggleSelectAll(state, action);

        case ActionType.SHOW_CONTEXT_MENU:
            return handleShowContextMenu(state, action);

        case ActionType.HIDE_CONTEXT_MENU:
            return handleHideContextMenu(state);

        default:
            return state;
    }
}
