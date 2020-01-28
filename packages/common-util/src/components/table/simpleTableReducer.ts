import { produce } from 'immer';
import { Column } from './simpleTableTypes';

export type ColumnState = {
    id: number;
    column: Column;
    width: number;
    selected: boolean;
    editing: boolean;
}

export type RowState = {
    id: number;
    values: unknown[];
    selected: boolean;
}

export type TableState = {
    columnTemplate: Column;
    columns: ColumnState[];
    rows: RowState[];
    i: number;
    j: number;
}

export type InitParams = {
    columnTemplate: Column;
    columns: Column[];
    rows: unknown[][];
}

export enum TableActionType {
    RESET='RESET',
    SET_ALL_ROWS_SELECTED='SELECT_ALL_ROWS',
    SET_ROW_SELECTED='SET_ROW_SELECTED',
    SET_COLUMN_SELECTED='SET_COLUMN_SELECTED',
    RESIZE_COLUMN='RESIZE_COLUMN',
    MOVE_ROW='MOVE_ROW',
    MOVE_COLUMN='MOVE_COLUMN',

    INSERT_ROW_BEFORE='INSERT_ROW_BEFORE',
    INSERT_ROW_AFTER='INSERT_ROW_AFTER',
    DELETE_SELECTED_ROWS='DELETE_SELECTED_ROWS',

    INSERT_COLUMN_BEFORE='INSERT_COLUMN_BEFORE',
    INSERT_COLUMN_AFTER='INSERT_COLUMN_AFTER',
    DELETE_SELECTED_COLUMNS='DELETE_SELECTED_COLUMNS'
}

export type ResetAction = {
    type: TableActionType.RESET;
    params: InitParams;
}

export type SetAllRowsSelectedAction = {
    type: TableActionType.SET_ALL_ROWS_SELECTED;
    selected: boolean;
}

export type SetRowSelectedAction = {
    type: TableActionType.SET_ROW_SELECTED;
    row: number;
    selected: boolean;
}

export type MoveRowAction = {
    type: TableActionType.MOVE_ROW;
    from: number;
    to: number;
}

export type MoveColumnAction = {
    type: TableActionType.MOVE_COLUMN;
    from: number;
    to: number;
}

export type SetColumnSelectedAction = {
    type: TableActionType.SET_COLUMN_SELECTED;
    col: number;
    selected: boolean;
}

export type ResizeColumnAction = {
    type: TableActionType.RESIZE_COLUMN;
    col: number;
    width: number;
}

export type InsertRowBeforeAction = {
    type: TableActionType.INSERT_ROW_BEFORE;
}

export type InsertRowAfterAction = {
    type: TableActionType.INSERT_ROW_AFTER;
}

export type DeleteSelectedRowsAction = {
    type: TableActionType.DELETE_SELECTED_ROWS;
}

export type InsertColumnBeforeAction = {
    type: TableActionType.INSERT_COLUMN_BEFORE;
}

export type InsertColumnAfterAction = {
    type: TableActionType.INSERT_COLUMN_AFTER;
}

export type DeleteSelectedColumnsAction = {
    type: TableActionType.DELETE_SELECTED_COLUMNS;
}

export type TableAction =
    | ResetAction
    | MoveRowAction
    | MoveColumnAction
    | SetAllRowsSelectedAction
    | SetRowSelectedAction
    | SetColumnSelectedAction
    | ResizeColumnAction
    | InsertRowBeforeAction
    | InsertRowAfterAction
    | DeleteSelectedRowsAction
    | InsertColumnBeforeAction
    | InsertColumnAfterAction
    | DeleteSelectedColumnsAction;


export function init(params: InitParams): TableState {
    const columnStates = params.columns.map<ColumnState>((column, index) => ({
        id: index,
        column,
        editing: false,
        selected: false,
        width: column.width
    }));

    const rowStates = params.rows.map<RowState>((row, index) => ({
        id: index,
        values: row,
        selected: false
    }));

    return {
        columnTemplate: params.columnTemplate,
        columns: columnStates,
        rows: rowStates,
        i: rowStates.length,
        j: columnStates.length
    };
}

function createRow(columns: ColumnState[], id: number): RowState {
    const values = new Array<unknown>(columns.length);
    for (let i = 0, n = columns.length; i < n; i++) {
        values[i] = columns[i].column.initialValue;
    }

    return {
        id,
        selected: false,
        values
    }
}

function createColumn(columnTemplate: Column, id: number): ColumnState {
    return {
        id,
        column: columnTemplate,
        width: columnTemplate.width,
        editing: false,
        selected: false
    };
}

function deselectAllRows(state: TableState) {
    const rows = state.rows;
    for (let i = 0, n = rows.length; i < n; i++) {
        rows[i].selected = false;
    }
}

function deselectAllColumns(state: TableState) {
    const cols = state.columns;
    for (let i = 0, n = cols.length; i < n; i++) {
        cols[i].selected = false;
    }
}

const handlers: { [K in TableActionType]: (state: TableState, action: Extract<TableAction, { type: K }>) => TableState } = {
    [TableActionType.RESET](state, action) {
        return init(action.params);
    },

    [TableActionType.RESIZE_COLUMN]: produce((state: TableState, action: ResizeColumnAction) => {
        const columnState = state.columns[action.col];
        if (!columnState) return;

        columnState.width = action.width;
    }),

    [TableActionType.MOVE_ROW]: produce((state: TableState, action: MoveRowAction) => {
        let to = action.to;
        let from = action.from;
        const row = state.rows[from];

        state.rows.splice(from, 1);
        state.rows.splice(to, 0, row);
    }),

    [TableActionType.MOVE_COLUMN]: produce((state: TableState, action: MoveColumnAction) => {
        let to = action.to;
        let from = action.from;
        const column = state.columns[from];

        state.columns.splice(from, 1);
        state.columns.splice(to, 0, column);

        const rows = state.rows;
        for (let i = 0, n = state.rows.length; i < n; i++) {
            const row = rows[i];
            const value = row.values[from];

            row.values.splice(from, 1);
            row.values.splice(to, 0, value);
        }
    }),

    [TableActionType.SET_ALL_ROWS_SELECTED]: produce((state: TableState, action: SetAllRowsSelectedAction) => {
        const rows = state.rows;
        for (let i = 0, n = rows.length; i < n; i++) {
            rows[i].selected = action.selected;
        }

        deselectAllColumns(state);
    }),

    [TableActionType.SET_ROW_SELECTED]: produce((state: TableState, action: SetRowSelectedAction) => {
        const row = state.rows[action.row];
        
        if (row) {
            row.selected = action.selected;
        }

        deselectAllColumns(state);
    }),

    [TableActionType.SET_COLUMN_SELECTED]: produce((state: TableState, action: SetColumnSelectedAction) => {
        const column = state.columns[action.col];
        
        if (column) {
            column.selected = action.selected;
        }

        deselectAllRows(state);
    }),

    [TableActionType.INSERT_ROW_BEFORE]: produce((state: TableState) => {
        const rowTemplate = createRow(state.columns, state.i++);
        state.rows = state.rows.flatMap(row => {
            if (row.selected) {
                row.selected = false;
                return [rowTemplate, row];
            } else {
                return row;
            }
        });
    }),

    [TableActionType.INSERT_ROW_AFTER]: produce((state: TableState) => {
        const rowTemplate = createRow(state.columns, state.i++);
        state.rows = state.rows.flatMap(row => {
            if (row.selected) {
                row.selected = false;
                return [row, rowTemplate];
            } else {
                return row;
            }
        });
    }),

    [TableActionType.DELETE_SELECTED_ROWS]: produce((state: TableState) => {
        state.rows = state.rows.filter(row => !row.selected);
    }),

    [TableActionType.INSERT_COLUMN_BEFORE]: produce((state: TableState) => {
        const columnTemplate = state.columnTemplate;
        const columns = state.columns;
        const rows = state.rows;
        const columnState = createColumn(columnTemplate, state.j++);

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].selected) {
                columns[i].selected = false;
                columns.splice(i, 0, columnState);

                for (let j = 0, n = rows.length; j < n; j++) {
                    rows[j].values.splice(i, 0, columnTemplate.initialValue);
                }

                ++i;
            }
        }
    }),

    [TableActionType.INSERT_COLUMN_AFTER]: produce((state: TableState) => {
        const columnTemplate = state.columnTemplate;
        const columns = state.columns;
        const rows = state.rows;
        const columnState = createColumn(columnTemplate, state.j++);
        
        for (let i = 0; i < columns.length; i++) {
            if (columns[i].selected) {
                columns[i].selected = false;
                columns.splice(i + 1, 0, columnState);

                for (let j = 0, n = rows.length; j < n; j++) {
                    rows[j].values.splice(i + 1, 0, columnTemplate.initialValue);
                }

                ++i;
            }
        }
    }),

    [TableActionType.DELETE_SELECTED_COLUMNS]: produce((state: TableState) => {
        const columns = state.columns;
        const rows = state.rows;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].selected) {
                columns.splice(i, 1);

                for (let j = 0, n = rows.length; j < n; j++) {
                    rows[j].values.splice(i, 1);
                }

                --i;
            }
        }
    })
};

export function tableReducer(state: TableState, action: TableAction) {
    const handler = handlers[action.type];

    if (handler) {
        return handler(state, action as any);

    } else {
        return state;
    }
}

export function reset(params: InitParams): ResetAction {
    return { type: TableActionType.RESET, params };
}

export function setAllRowsSelected(selected: boolean): SetAllRowsSelectedAction {
    return { type: TableActionType.SET_ALL_ROWS_SELECTED, selected };
}

export function setRowSelected(row: number, selected: boolean): SetRowSelectedAction {
    return { type: TableActionType.SET_ROW_SELECTED, row, selected };
}

export function moveRow(from: number, to: number): MoveRowAction {
    return { type: TableActionType.MOVE_ROW, from, to };
}

export function moveColumn(from: number, to: number): MoveColumnAction {
    return { type: TableActionType.MOVE_COLUMN, from, to };
}

export function setColumnSelected(col: number, selected: boolean): SetColumnSelectedAction {
    return { type: TableActionType.SET_COLUMN_SELECTED, col, selected };
}

export function resizeColumn(col: number, width: number): ResizeColumnAction {
    return { type: TableActionType.RESIZE_COLUMN, col, width };
}

export function insertRowBefore(): InsertRowBeforeAction {
    return { type: TableActionType.INSERT_ROW_BEFORE };
}

export function insertRowAfter(): InsertRowAfterAction {
    return { type: TableActionType.INSERT_ROW_AFTER };
}

export function deleteSelectedRows(): DeleteSelectedRowsAction {
    return { type: TableActionType.DELETE_SELECTED_ROWS };
}

export function deleteSelectedColumns(): DeleteSelectedColumnsAction {
    return { type: TableActionType.DELETE_SELECTED_COLUMNS };
}
