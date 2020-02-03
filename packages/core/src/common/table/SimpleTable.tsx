import React, { useReducer, useEffect, useRef, useMemo } from 'react';

import { Column, CellRenderer } from './simpleTableTypes';
import { tableReducer, reset, init, InitParams } from './simpleTableReducer';
import SimpleTableHeader from './SimpleTableHeader';
import SimpleTableRow from './SimpleTableRow';

type Props<T> = {
    columnTemplate: Column;
    columns: Column[];
    rows: T[][];
    onChanged?: (columns: Column[], rows: T[][]) => void;
    renderCell?: CellRenderer<T>;
}

function SimpleTable<T>(props: Props<T>) {
    const params: InitParams =  { columnTemplate: props.columnTemplate, columns: props.columns, rows: props.rows };
    const [state, dispatch] = useReducer(tableReducer(props), params, init);

    // reset the state when updated from outside
    const prevRef = useRef(params);
    useEffect(() => {
        if (props.columns !== prevRef.current.columns ||
            props.rows !== prevRef.current.rows
        ) {
            prevRef.current.columns = props.columns;
            prevRef.current.rows = props.rows;
            dispatch(reset(params));
        }
    });

    // notify parent when the data changed
    const rowsRef = useRef(state.rows);
    const colsRef = useRef(state.columns);
    useEffect(() => {
        if (props.onChanged &&
            (rowsRef.current !== state.rows || colsRef.current !== state.columns)
        ) {
            rowsRef.current = state.rows;
            colsRef.current = state.columns;
            props.onChanged(state.columns, state.rows as T[][]);
        }
    });

    // table uses CSS grid layout. Compute here the gridTemplateColumns property. 
    const gridTemplateColumns: string = useMemo(() => {
        const cols: string[] = state.columnStates.map((col) => {
            return col.width + 'px';
        });

        return '30px ' +  cols.join(' ') + ' auto';
    }, [state.columnStates]);

    return (
        <div className="ngraph-table-container">
            <div className="ngraph-table" style={{ gridTemplateColumns }}>
                <div className="ngraph-table-headers">
                    <div className="ngraph-table-header ngraph-table-row-handle"/>
                    {state.columnStates.map((columnState, index) => (
                        <SimpleTableHeader
                            key={columnState.id}
                            index={index}
                            numCols={state.columnStates.length}
                            column={state.columns[index]}
                            columnState={columnState}
                            dispatch={dispatch}
                        />
                    ))}
                    <div className="ngraph-table-header"/>
                </div>
                {state.rowStates.map((rowState, index) => (
                    <SimpleTableRow
                        key={rowState.id}
                        index={index}
                        numRows={state.rowStates.length}
                        row={state.rows[index]}
                        rowState={rowState}
                        columns={state.columns}
                        dispatch={dispatch}
                        renderCell={props.renderCell}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(SimpleTable) as typeof SimpleTable;
