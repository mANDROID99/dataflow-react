import { produce } from 'immer';
import { Column } from './simpleTableTypes';
import { move } from '../../utils/arrayUtils';

export type ColumnState = {
    id: number;
    width: number;
    editing: boolean;
}

export type CellState = {
    editing: boolean;
    selected: boolean;
}

export type RowState = {
    id: number;
    cells: CellState[];
}

export type ComponentProps = {
    columnTemplate: Column;
}

export type TableState = {
    columns: Column[];
    rows: unknown[][];

    columnStates: ColumnState[];
    rowStates: RowState[];

    ci: number;
    cj: number;
}

export type InitParams = {
    columnTemplate: Column;
    columns: Column[];
    rows: unknown[][];
}

export enum TableActionType {
    RESET='RESET',
    RESIZE_COLUMN='RESIZE_COLUMN',
    MOVE_ROW='MOVE_ROW',
    MOVE_COLUMN='MOVE_COLUMN',
    SET_CELL_SELECTED='SET_CELL_SELECTED',
    SET_CELL_VALUE='SET_CELL_VALUE',
    SET_CELL_EDITING='SET_CELL_EDITING',

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
    | InsertRowBeforeAction
    | InsertRowAfterAction
    | DeleteRowAction
    | SetColumnNameAction
    | SetColumnNameEditingAction
    | InsertColumnBeforeAction
    | InsertColumnAfterAction
    | DeleteColumnAction;

function createColumnState(column: Column, id: number): ColumnState {
    return {
        id,
        width: column.width,
        editing: true
    };
}

function createCellState(): CellState {
    return {
        editing: false,
        selected: false
    };
}

function createRowState(columns: Column[], id: number): RowState {
    const cells = columns.map(createCellState);
    return {
        id,
        cells
    }
}

function createRow(columns: Column[]): unknown[] {
    return columns.map(col => col.initialValue);
}

function updateCellState(state: TableState, i: number, j: number, updater: (cell: CellState, row: RowState) => void) {
    const row = state.rowStates[i];
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

function mapRowsToStates(rows: unknown[][], columns: Column[]): RowState[] {
    return rows.map<RowState>((datum, i) => {
        const cells = columns.map<CellState>((_, j) => {
            const value = datum[j];

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


const handlers: { [K in TableActionType]: (state: TableState, action: Extract<TableAction, { type: K }>, props: ComponentProps) => TableState } = {
    [TableActionType.RESET](_, action) {
        return init(action.params);
    },

    [TableActionType.RESIZE_COLUMN]: produce((state: TableState, action: ResizeColumnAction) => {
        const columnState = state.columnStates[action.col];
        if (columnState) {
            columnState.width = action.width;
        }
    }),

    [TableActionType.MOVE_ROW]: produce((state: TableState, action: MoveRowAction) => {
        let to = action.to;
        let from = action.from;
        move(state.rowStates, from, to);
        move(state.rows, from, to);
    }),

    [TableActionType.MOVE_COLUMN]: produce((state: TableState, action: MoveColumnAction) => {
        let to = action.to;
        let from = action.from;

        move(state.columnStates, from, to);
        move(state.columns, from, to);

        for (const rowState of state.rowStates) {
            move(rowState.cells, from, to);
        }

        for (const row of state.rows) {
            move(row, from, to);
        }
    }),

    [TableActionType.INSERT_ROW_BEFORE]: produce((state: TableState, action: InsertRowBeforeAction) => {
        const rowState = createRowState(state.columns, state.ci++);
        state.rowStates.splice(action.index, 0, rowState);

        const row = createRow(state.columns)
        state.rows.splice(action.index, 0, row);
    }),

    [TableActionType.INSERT_ROW_AFTER]: produce((state: TableState, action: InsertRowAfterAction) => {
        const rowState = createRowState(state.columns, state.ci++);
        state.rowStates.splice(action.index + 1, 0, rowState);

        const row = createRow(state.columns);
        state.rows.splice(action.index + 1, 0, row);
    }),

    [TableActionType.DELETE_ROW]: produce((state: TableState, action: DeleteRowAction) => {
        state.rowStates.splice(action.index, 1);
        state.rows.splice(action.index, 1);
    }),

    [TableActionType.SET_COLUMN_NAME_EDITING]: produce((state: TableState, action: SetColumnNameEditingAction) => {
        const column = state.columnStates[action.index];
        if (column) {
            column.editing = action.editing;
        }
    }),

    [TableActionType.SET_COLUMN_NAME]: produce((state: TableState, action: SetColumnNameAction) => {
        const columnState = state.columnStates[action.index];
        if (columnState) {
            columnState.editing = false;
        }

        const column = state.columns[action.index];
        if (column) {
            column.name = action.name;
        }
    }),

    [TableActionType.INSERT_COLUMN_BEFORE]: produce((state: TableState, action: InsertColumnBeforeAction, props: ComponentProps) => {
        const column = props.columnTemplate;
        const columnState = createColumnState(column, state.cj++);

        state.columnStates.splice(action.index, 0, columnState);
        state.columns.splice(action.index, 0, column);
        
        const cellState = createCellState();
        for (const rowState of state.rowStates) {
            rowState.cells.splice(action.index, 0, cellState);
        }

        const cell = column.initialValue;
        for (const row of state.rows) {
            row.splice(action.index, 0, cell);
        }
    }),

    [TableActionType.INSERT_COLUMN_AFTER]: produce((state: TableState, action: InsertColumnAfterAction, props: ComponentProps) => {
        const column = props.columnTemplate;
        const columnState = createColumnState(column, state.cj++);

        state.columnStates.splice(action.index + 1, 0, columnState);
        state.columns.splice(action.index + 1, 0, column);

        const cellState = createCellState();
        for (const rowState of state.rowStates) {
            rowState.cells.splice(action.index + 1, 0, cellState);
        }

        const cell = column.initialValue;
        for (const row of state.rows) {
            row.splice(action.index + 1, 0, cell);
        }
    }),

    [TableActionType.DELETE_COLUMN]: produce((state: TableState, action: DeleteColumnAction) => {
        const columnStates = state.columnStates;
        columnStates.splice(action.index, 1);

        const columns = state.columns;
        columns.splice(action.index, 1);

        for (const rowState of state.rowStates) {
            rowState.cells.splice(action.index, 1);
        }

        for (const row of state.rows) {
            row.splice(action.index, 1);
        }
    }),

    [TableActionType.SET_CELL_SELECTED]: produce((state: TableState, action: SelectCellAction) => {
        updateCellState(state, action.i, action.j, (cellState) => {
            cellState.selected = action.selected;
        });
    }),

    [TableActionType.SET_CELL_EDITING]: produce((state: TableState, action: SetCellEditingAction) => {
        updateCellState(state, action.i, action.j, (cellState) => {
            cellState.editing = action.editing;
        });
    }),

    [TableActionType.SET_CELL_VALUE]: produce((state: TableState, action: SetCellValueAction) => {
        updateCellState(state, action.i, action.j, (cellState) => {
            cellState.selected = false;
            cellState.editing = false;
        });

        const row = state.rows[action.i];
        if (row) {
            row[action.j] = action.value;
        }
    })
};

export function init(params: InitParams): TableState {
    const columnStates = mapColumnsToColumnStates(params.columns);
    const rowStates = mapRowsToStates(params.rows, params.columns);

    return {
        columns: params.columns,
        rows: params.rows,

        columnStates: columnStates,
        rowStates: rowStates,

        ci: rowStates.length,
        cj: columnStates.length
    };
}

export function tableReducer(props: ComponentProps) {
    return (state: TableState, action: TableAction) => {
        const handler = handlers[action.type];

        if (handler) {
            return handler(state, action as any, props);

        } else {
            return state;
        }
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
