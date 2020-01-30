import React, { useReducer, useEffect, useRef, useMemo } from 'react';

import { Column } from './simpleTableTypes';
import { tableReducer, reset, init } from './simpleTableReducer';
import SimpleTableHeader from './SimpleTableHeader';
import SimpleTableRow from './SimpleTableRow';

type Props = {
    columnTemplate: Column;
    columns: Column[];
    rows: unknown[][];
}

function SimpleTable(props: Props) {
    const params = { columnTemplate: props.columnTemplate, columns: props.columns, rows: props.rows };
    const [state, dispatch] = useReducer(tableReducer, params, init);

    // reset the state when updated from outside
    const ref = useRef(params)
    useEffect(() => {
        if (props.columns !== ref.current.columns || props.rows !== ref.current.rows) {
            ref.current.columns = props.columns;
            ref.current.rows = props.rows;
            dispatch(reset(params));
        }
    }, [props.columns, props.rows]);

    // table uses CSS grid layout. Compute here the gridTemplateColumns property. 
    const gridTemplateColumns: string = useMemo(() => {
        const cols: string[] = state.columns.map((col, i) => {
            return col.width + 'px';
        });

        return '30px ' +  cols.join(' ') + ' auto';
    }, [state.columns]);

    // compute whether all rows are currently selected
    const allRowsSelected = useMemo(() => {
        return !state.rows.some(row => !row.selected);
    }, [state.rows]);

    return (
        <div className="ngraph-table-container">
            <div className="ngraph-table" style={{ gridTemplateColumns }}>
                <div className="ngraph-table-headers">
                    <div className="ngraph-table-header ngraph-table-row-handle"/>
                    {state.columns.map((columnState, index) => (
                        <SimpleTableHeader
                            key={columnState.id}
                            index={index}
                            numCols={state.columns.length}
                            columnState={columnState}
                            dispatch={dispatch}
                        />
                    ))}
                    <div className="ngraph-table-header"/>
                </div>
                {state.rows.map((rowState, index) => (
                    <SimpleTableRow
                        key={rowState.id}
                        index={index}
                        numRows={state.rows.length}
                        rowState={rowState}
                        dispatch={dispatch}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(SimpleTable);
