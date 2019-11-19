import React, { Dispatch, useRef } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Column, Action, ActionType } from "./DataGrid";
import InputEditor from './InputEditor';
import { useDrag } from '../../helpers/useDrag';

type Props = {
    col: number;
    column: Column;
    columnWidth: number;
    last: boolean;
    dispatch: Dispatch<Action>;
}

function DataGridHeaderComponent({ col, column, columnWidth, last, dispatch }: Props): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    const onValueChanged = (value: string): void => {
        dispatch({ type: ActionType.SET_COLUMN_NAME, col, name: value });
    };

    const removeColumn = (): void => {
        dispatch({ type: ActionType.DELETE_COLUMN, col });
    };

    useDrag<{ startX: number; startWidth: number }>(ref, {
        onStart: (event) => {
            return {
                startX: event.clientX,
                startWidth: columnWidth
            };
        },
        onDrag: (event, { startX, startWidth }) => {
            const width = Math.max(column.minWidth ?? 0, startWidth + event.clientX - startX);
            dispatch({ type: ActionType.SET_COLUMN_WIDTH, col, width });
        }
    });

    return (
        <div className={classNames("datagrid-header", { grow: last })} style={{ width: columnWidth, minWidth: columnWidth }}>
            <div className="datagrid-cell-content">
                <div className="datagrid-header-label">
                    <InputEditor value={column.name} onValueChanged={onValueChanged}/>
                </div>
                <div className="datagrid-action-btn" onClick={removeColumn}>
                    <FontAwesomeIcon icon="times"/>
                </div>
            </div>
            <div ref={ref} className="datagrid-resizer" style={{ visibility: last ? 'hidden' : 'visible' }}/>
        </div>
    );
}

const DataGridHeader = React.memo(DataGridHeaderComponent);

type HeaderGroupProps = {
    columns: Column[];
    columnWidths: number[];
    dispatch: Dispatch<Action>;
}

function DataGridHeaderGroupComponent({ columns, columnWidths, dispatch }: HeaderGroupProps): React.ReactElement {

    const addColumn = (): void => {
        const column: Column = { name: 'Column', width: 100, minWidth: 50 };
        dispatch({ type: ActionType.ADD_COLUMN, column });
    };

    return (
        <div className="datagrid-headers">
            <div className="datagrid-header">
                <div className="datagrid-cell-content">
                    <div className="datagrid-action-btn" onClick={addColumn}>
                        <FontAwesomeIcon icon="plus-square"/>
                    </div>
                </div>
            </div>
            {columns.map((column, index) => (
                <DataGridHeader
                    key={index}
                    col={index}
                    column={column}
                    columnWidth={columnWidths[index]}
                    dispatch={dispatch}
                    last={index === columns.length - 1}
                />
            ))}
        </div>
    );
}

export const DataGridHeaderGroup = React.memo(DataGridHeaderGroupComponent);
