import { produce } from 'immer';
import { Column } from './simpleTableTypes';

export type ColumnState = {
    id: number;
    column: Column;
    width: number;
    editing: boolean;
}

export type CellState = {
    value: unknown;
    editing: boolean;
    selected: boolean;
}

export type RowState = {
    id: number;
    cells: CellState[];
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
    data: { [key: string]: unknown }[];
}

export enum TableActionType {
    RESET='RESET',
    RESIZE_COLUMN='RESIZE_COLUMN',
    MOVE_ROW='MOVE_ROW',
    MOVE_COLUMN='MOVE_COLUMN',
    SET_CELL_SELECTED='SET_CELL_SELECTED',
    SET_CELL_VALUE='SET_CELL_VALUE',
    SET_CELL_EDITING='SET_CELL_EDITING',
    CLICK_OUTSIDE_CELL='CLICK_OUTSIDE_CELL',

    INSERT_ROW_BEFORE='INSERT_ROW_BEFORE',
    INSERT_ROW_AFTER='INSERT_ROW_AFTER',
    DELETE_ROW='DELETE_SELECTED_ROWS',

    SET_COLUMN_NAME='SET_COLUMN_NAME',
    SET_COLUMN_NAME_EDITING='SET_COLUMN_NAME_EDITING',
    INSERT_COLUMN_BEFORE='INSERT_COLUMN_BEFORE',
    INSERT_COLUMN_AFTER='INSERT_COLUMN_AFTER',
    DELETE_COLUMN='DELETE_SELECTED_COLUMNS'
}

export type ResetAction = {
    type: TableActionType.RESET;
    params: InitParams;
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

export type ResizeColumnAction = {
    type: TableActionType.RESIZE_COLUMN;
    col: number;
    width: number;
}

export type SelectCellAction = {
    type: TableActionType.SET_CELL_SELECTED;
    i: number;
    j: number;
    selected: boolean;
}

export type SetCellEditingAction = {
    type: TableActionType.SET_CELL_EDITING;
    i: number;
    j: number;
    editing: boolean;
}

export type SetCellValueAction = {
    type: TableActionType.SET_CELL_VALUE;
    i: number;
    j: number;
    value: unknown;
}

export type ClickOutsideCellAction = {
    type: TableActionType.CLICK_OUTSIDE_CELL;
    i: number;
    j: number;
}

export type InsertRowBeforeAction = {
    type: TableActionType.INSERT_ROW_BEFORE;
    index: number;
}

export type InsertRowAfterAction = {
    type: TableActionType.INSERT_ROW_AFTER;
    index: number;
}

export type DeleteRowAction = {
    type: TableActionType.DELETE_ROW;
    index: number;
}

export type SetColumnNameAction = {
    type: TableActionType.SET_COLUMN_NAME;
    index: number;
    name: string;
}

export type SetColumnNameEditingAction = {
    type: TableActionType.SET_COLUMN_NAME_EDITING;
    index: number;
    editing: boolean;
}

export type InsertColumnBeforeAction = {
    type: TableActionType.INSERT_COLUMN_BEFORE;
    index: number;
}

export type InsertColumnAfterAction = {
    type: TableActionType.INSERT_COLUMN_AFTER;
    index: number;
}

export type DeleteColumnAction = {
    type: TableActionType.DELETE_COLUMN;
    index: number;
}


export type TableAction =
    | ResetAction
    | MoveRowAction
    | MoveColumnAction
    | ResizeColumnAction
    | SelectCellAction
    | SetCellValueAction
    | SetCellEditingAction
    | ClickOutsideCellAction
    | InsertRowBeforeAction
    | InsertRowAfterAction
    | DeleteRowAction
    | SetColumnNameAction
    | SetColumnNameEditingAction
    | InsertColumnBeforeAction
    | InsertColumnAfterAction
    | DeleteColumnAction;

function createColumn(columnTemplate: Column, id: number): ColumnState {
    return {
        id,
        column: columnTemplate,
        width: columnTemplate.width,
        editing: false
    };
}

function createCell(value: unknown): CellState {
    return {
        value,
        editing: false,
        selected: false
    };
}

function createRow(columns: ColumnState[], id: number): RowState {
    const values = new Array<CellState>(columns.length);
    for (let i = 0, n = columns.length; i < n; i++) {
        const value = columns[i].column.initialValue;
        values[i] = createCell(value);
    }

    return {
        id,
        cells: values
    }
}

function updateCell(state: TableState, i: number, j: number, updater: (cell: CellState, row: RowState) => void) {
    const row = state.rows[i];
    if (!row) return;

    const cell = row.cells[j];
    if (!cell) return;

    updater(cell, row);
}

function mapColumnsToColumnStates(columns: Column[]): ColumnState[] {
    return columns.map<ColumnState>((column, i) => ({
        id: i,
        column,
        editing: false,
        selected: false,
        width: column.width
    }));
}

function mapDataToRowStates(data: { [key: string]: unknown }[], columns: Column[]): RowState[] {
    return data.map<RowState>((datum, i) => {
        const cells = columns.map<CellState>((column) => {
            const value = column.key in datum ? datum[column.key] : column.initialValue;

            return {
                value,
                editing: false,
                selected: false
            };
        });

        return {
            id: i,
            cells,
            selected: false
        };
    });
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
            const value = row.cells[from];

            row.cells.splice(from, 1);
            row.cells.splice(to, 0, value);
        }
    }),

    [TableActionType.INSERT_ROW_BEFORE]: produce((state: TableState, action: InsertRowBeforeAction) => {
        const rowTemplate = createRow(state.columns, state.i++);
        state.rows.splice(action.index, 0, rowTemplate);
    }),

    [TableActionType.INSERT_ROW_AFTER]: produce((state: TableState, action: InsertRowAfterAction) => {
        const rowTemplate = createRow(state.columns, state.i++);
        state.rows.splice(action.index + 1, 0, rowTemplate);
    }),

    [TableActionType.DELETE_ROW]: produce((state: TableState, action: DeleteRowAction) => {
        state.rows.splice(action.index, 1);
    }),

    [TableActionType.SET_COLUMN_NAME_EDITING]: produce((state: TableState, action: SetColumnNameEditingAction) => {
        const column = state.columns[action.index];
        if (!column) return;
        column.editing = action.editing;
    }),

    [TableActionType.SET_COLUMN_NAME]: produce((state: TableState, action: SetColumnNameAction) => {
        const column = state.columns[action.index];
        if (!column) return;
        
        column.editing = false;
        column.column.name = action.name;
    }),

    [TableActionType.INSERT_COLUMN_BEFORE]: produce((state: TableState, action: InsertColumnBeforeAction) => {
        const columnTemplate = state.columnTemplate;
        const columnState = createColumn(columnTemplate, state.j++);
        state.columns.splice(action.index, 0, columnState);
        
        const rows = state.rows;
        for (let i = 0, n = rows.length; i < n; i++) {
            const cell = createCell(columnTemplate.initialValue);
            rows[i].cells.splice(action.index, 0, cell);
        }
    }),

    [TableActionType.INSERT_COLUMN_AFTER]: produce((state: TableState, action: InsertColumnAfterAction) => {
        const columnTemplate = state.columnTemplate;
        const columnState = createColumn(columnTemplate, state.j++);
        state.columns.splice(action.index + 1, 0, columnState);
        
        const rows = state.rows;
        for (let i = 0, n = rows.length; i < n; i++) {
            const cell = createCell(columnTemplate.initialValue);
            rows[i].cells.splice(action.index + 1, 0, cell);
        }
    }),

    [TableActionType.DELETE_COLUMN]: produce((state: TableState, action: DeleteColumnAction) => {
        const columns = state.columns;
        const rows = state.rows;
        columns.splice(action.index, 1);

        for (let i = 0, n = rows.length; i < n; i++) {
            rows[i].cells.splice(action.index, 1);
        }
    }),

    [TableActionType.SET_CELL_SELECTED]: produce((state: TableState, action: SelectCellAction) => {
        updateCell(state, action.i, action.j, (cell) => {
            cell.selected = action.selected;
        });
    }),

    [TableActionType.SET_CELL_EDITING]: produce((state: TableState, action: SetCellEditingAction) => {
        updateCell(state, action.i, action.j, (cell) => {
            cell.editing = action.editing;
        });
    }),

    [TableActionType.SET_CELL_VALUE]: produce((state: TableState, action: SetCellValueAction) => {
        updateCell(state, action.i, action.j, (cell) => {
            cell.selected = false;
            cell.editing = false;
            cell.value = action.value;
        });
    }),

    [TableActionType.CLICK_OUTSIDE_CELL]: produce((state: TableState, action: ClickOutsideCellAction) => {
        updateCell(state, action.i, action.j, (cell) => {
            cell.selected = false;
            cell.editing = false;
        });
    })
};

export function init(params: InitParams): TableState {
    const columnStates = mapColumnsToColumnStates(params.columns);
    const rowStates = mapDataToRowStates(params.data, params.columns);

    return {
        columnTemplate: params.columnTemplate,
        columns: columnStates,
        rows: rowStates,
        i: rowStates.length,
        j: columnStates.length
    };
}

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

export function moveRow(from: number, to: number): MoveRowAction {
    return { type: TableActionType.MOVE_ROW, from, to };
}

export function moveColumn(from: number, to: number): MoveColumnAction {
    return { type: TableActionType.MOVE_COLUMN, from, to };
}

export function resizeColumn(col: number, width: number): ResizeColumnAction {
    return { type: TableActionType.RESIZE_COLUMN, col, width };
}

export function setColumnNameEditing(index: number, editing: boolean): SetColumnNameEditingAction {
    return { type: TableActionType.SET_COLUMN_NAME_EDITING, index, editing };
}

export function setColumnName(index: number, name: string): SetColumnNameAction {
    return { type: TableActionType.SET_COLUMN_NAME, index, name };
}

export function insertColumnBefore(index: number): InsertColumnBeforeAction {
    return { type: TableActionType.INSERT_COLUMN_BEFORE, index };
}

export function insertColumnAfter(index: number): InsertColumnAfterAction {
    return { type: TableActionType.INSERT_COLUMN_AFTER, index };
}

export function deleteColumn(index: number): DeleteColumnAction {
    return { type: TableActionType.DELETE_COLUMN, index };
}

export function insertRowBefore(index: number): InsertRowBeforeAction {
    return { type: TableActionType.INSERT_ROW_BEFORE, index };
}

export function insertRowAfter(index: number): InsertRowAfterAction {
    return { type: TableActionType.INSERT_ROW_AFTER, index };
}

export function deleteRow(index: number): DeleteRowAction {
    return { type: TableActionType.DELETE_ROW, index };
}

export function setCellSelected(i: number, j: number, selected: boolean): SelectCellAction {
    return { type: TableActionType.SET_CELL_SELECTED, i, j, selected };
}

export function setCellValue(i: number, j: number, value: unknown): SetCellValueAction {
    return { type: TableActionType.SET_CELL_VALUE, i, j, value };
}

export function setCellEditing(i: number, j: number, editing: boolean): SetCellEditingAction {
    return { type: TableActionType.SET_CELL_EDITING, i, j, editing };
}

export function clickOutsideCell(i: number, j: number): ClickOutsideCellAction {
    return { type: TableActionType.CLICK_OUTSIDE_CELL, i, j };
}
