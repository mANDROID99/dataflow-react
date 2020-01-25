import React, { useReducer, useMemo } from "react";
import { init, reducer, ActionType } from "./dataGridReducer";
import DataGridHeader from "./DataGridHeader";
import DataGridRow from "./DataGridRow";
import DataGridContextMenu from "./DataGridContextMenu";
import { DataGridInputValue } from "../../types/graphFieldInputTypes";
import Button from "../../common/Button";

type Props = {
    columns: string[];
    rows: string[][];
    onHide: () => void;
    onSubmit: (value: DataGridInputValue) => void;
}

function DataGridTable(props: Props) {
    const columnNames = props.columns;
    const rowValues = props.rows;

    const [state, dispatch] = useReducer(reducer, {
        columns: columnNames,
        rows: rowValues
    }, init);

    const handleSave = () => {
        const columnNames = state.columns.map(col => col.name);
        const rowValues = state.rows.map(row => row.values);
        props.onSubmit({
            columns: columnNames,
            rows: rowValues
        });
    };

    // datagrid uses CSS grid layout.
    // Compute here the gridTemplateColumns property. 
    const gridTemplateColumns: string = useMemo(() => {
        const nCols = state.columns.length;
        const cols: string[] = state.columns.map((col, i) => {
            if (i < nCols - 1) {
                return col.width + 'px';
            } else {
                return 'auto';
            }
        });

        return '30px ' +  cols.join(' ');
    }, [state.columns]);

    const allRowsSelected = useMemo(() => {
        return !state.rows.some(row => !row.selected);
    }, [state.rows]);

    const handleToggleAllSelected = () => {
        dispatch({ type: ActionType.TOGGLE_SELECT_ALL_ROWS, selected: !allRowsSelected });
    };

    const handleShowContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        dispatch({
            type: ActionType.SHOW_CONTEXT_MENU,
            x: event.clientX,
            y: event.clientY
        });
    };

    return (
        <>
            <div className="ngraph-datagrid-table-container" onContextMenu={handleShowContextMenu}>
                <div className="ngraph-datagrid-table" style={{ gridTemplateColumns }}>
                    <div className="ngraph-datagrid-table-headers">
                        <div className="ngraph-datagrid-table-header">
                            <input
                                type="checkbox"
                                checked={allRowsSelected}
                                onChange={handleToggleAllSelected}
                            />
                        </div>
                        {state.columns.map((column, index) => {
                            const isLast = index === state.columns.length - 1;
                            return (
                                <DataGridHeader
                                    key={index}
                                    col={index}
                                    columnState={column}
                                    dispatch={dispatch}
                                    last={isLast}
                                />
                            );
                        })}
                    </div>
                    <div className="ngraph-datagrid-table-rows">
                        {state.rows.map((row, index) => {
                            return (
                                <DataGridRow
                                    key={index}
                                    row={index}
                                    rowState={row}
                                    dispatch={dispatch}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="ngraph-modal-footer">
                <Button onClick={props.onHide} variant="secondary">Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
            <DataGridContextMenu {...state.contextMenu} dispatch={dispatch}/>
        </>
    );
}

export default DataGridTable;
