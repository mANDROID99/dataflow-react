
export type RowMenuState = {
    row: number;
    x: number;
    y: number;
}

export type ColumnMenuState = {
    col: number;
    x: number;
    y: number;
}

export type State = {
    columns: string[];
    rows: string[][];
    menuRow?: RowMenuState;
    menuColumn?: ColumnMenuState;
}

export enum ActionType {
    UPDATE_ROWS,
    SHOW_ROW_MENU,
    HIDE_ROW_MENU,
    SHOW_COLUMN_MENU,
    HIDE_COLUMN_MENU,
    INSERT_ROW_BEFORE,
    INSERT_ROW_AFTER,
    DELETE_ROW,
    INSERT_COLUMN_BEFORE,
    INSERT_COLUMN_AFTER,
    DELETE_COLUMN,
    SET_COLUMN_NAME
}

export type Action =
    | { type: ActionType.UPDATE_ROWS, fromRow: number, toRow: number, updated: string[] }
    | { type: ActionType.SHOW_COLUMN_MENU, col: number, x: number, y: number }
    | { type: ActionType.HIDE_COLUMN_MENU }
    | { type: ActionType.SHOW_ROW_MENU, row: number, x: number, y: number }
    | { type: ActionType.HIDE_ROW_MENU }
    | { type: ActionType.INSERT_ROW_AFTER, row: number }
    | { type: ActionType.INSERT_ROW_BEFORE, row: number }
    | { type: ActionType.DELETE_ROW, row: number }
    | { type: ActionType.INSERT_COLUMN_BEFORE, col: number }
    | { type: ActionType.INSERT_COLUMN_AFTER, col: number }
    | { type: ActionType.DELETE_COLUMN, col: number }
    | { type: ActionType.SET_COLUMN_NAME, col: number, name: string }
    ;

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.UPDATE_ROWS: {
            const { fromRow, toRow, updated } = action;
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                const row = rows[i].slice();
                rows[i] = row;
                for (let x in updated) row[x] = updated[x];
            }
            return { ...state, rows };
        }
        case ActionType.SHOW_ROW_MENU: {
            const menuRow: RowMenuState = {
                row: action.row,
                x: action.x,
                y: action.y
            }
            return { ...state, menuRow };
        }
        case ActionType.SHOW_COLUMN_MENU: {
            const menuColumn: ColumnMenuState = {
                col: action.col,
                x: action.x,
                y: action.y
            };
            return { ...state, menuColumn };
        }
        case ActionType.HIDE_ROW_MENU:
            return { ...state, menuRow: undefined };
        case ActionType.HIDE_COLUMN_MENU:
            return { ...state, menuColumn: undefined };
        case ActionType.INSERT_ROW_BEFORE:
        case ActionType.INSERT_ROW_AFTER: {
            const rows = state.rows.slice();
            const row = new Array(state.columns.length);
            row.fill('');

            let i = action.row;
            if (action.type === ActionType.INSERT_ROW_AFTER) {
                i++;
            }

            rows.splice(i, 0, row);
            return { ...state, rows };
        }
        case ActionType.DELETE_ROW: {
            const rows = state.rows.slice();
            rows.splice(action.row, 1);
            return { ...state, rows };
        }
        case ActionType.INSERT_COLUMN_BEFORE:
        case ActionType.INSERT_COLUMN_AFTER:
            const columns = state.columns.slice();
            columns.length++;

            let x = action.col;
            if (action.type === ActionType.INSERT_COLUMN_AFTER) {
                x++;
            }

            const nCols = columns.length;
            for (let j = x; j < nCols - 1; j++) {
                columns[j + 1] = columns[j];
            }
            
            columns[x] = '';

            const rows = state.rows.slice();
            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i].slice();
                rows[i] = row;
                row.length++;

                for (let j = x; j < nCols - 1; j++) {
                    row[j + 1] = row[j];
                }

                row[x] = '';
            }

            return { rows, columns };
        case ActionType.DELETE_COLUMN: {
            const columns = state.columns.slice();
            const x = action.col;
            
            const nCols = columns.length;
            for (let i = x; i < nCols - 1; i++) {
                columns[i] = columns[i + 1];
            }

            columns.length--;

            const rows = state.rows.slice();
            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i].slice();
                rows[i] = row;

                for (let j = x; j < nCols - 1; j++) {
                    row[j] = row[j + 1];
                }

                row.length--;
            }

            return { rows, columns };
        
        }
        case ActionType.SET_COLUMN_NAME: {
            const columns = state.columns.slice();
            columns[action.col] = action.name;
            return { rows: state.rows, columns };
        }
    }
}