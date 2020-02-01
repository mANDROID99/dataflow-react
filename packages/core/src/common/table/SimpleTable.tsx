import React, { useReducer, useEffect, useRef, useMemo } from 'react';

import { Column } from './simpleTableTypes';
import { tableReducer, reset, init } from './simpleTableReducer';
import SimpleTableHeader from './SimpleTableHeader';
import SimpleTableRow from './SimpleTableRow';

type Props = {
    columnTemplate: Column;
    columns: Column[];
    data: { [key: string]: unknown }[];
}

function SimpleTable(props: Props) {
    const params = { columnTemplate: props.columnTemplate, columns: props.columns, data: props.data };
    const [state, dispatch] = useReducer(tableReducer, params, init);

    // reset the state when updated from outside
    const ref = useRef(params)
    useEffect(() => {
        if (props.columns !== ref.current.columns || props.data !== ref.current.data) {
            ref.current.columns = props.columns;
            ref.current.data = props.data;
            dispatch(reset(params));
        }
    }, [props.columns, props.data]);

    // table uses CSS grid layout. Compute here the gridTemplateColumns property. 
    const gridTemplateColumns: string = useMemo(() => {
        const cols: string[] = state.columns.map((col, i) => {
            return col.width + 'px';
        });

        return '30px ' +  cols.join(' ') + ' auto';
    }, [state.columns]);

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
                        columnStates={state.columns}
                        dispatch={dispatch}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(SimpleTable);
