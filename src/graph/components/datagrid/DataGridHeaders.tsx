import React, { Dispatch, useState, useRef } from 'react';
import { Column, Action, ActionType } from "./DataGrid";
import InputEditor from './InputEditor';
import { useDrag } from '../../helpers/useDrag';

type Props = {
    col: number;
    column: Column;
    columnWidth: number;
    dispatch: Dispatch<Action>;
}

function DataGridHeaderComponent({ col, column, columnWidth, dispatch }: Props): React.ReactElement {
    const [isEditing, setEditing] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const startEdit = (): void => {
        setEditing(true);
    };

    const onValueChanged = (value: string): void => {
        setEditing(false);
        dispatch({ type: ActionType.SET_COLUMN_NAME, col, name: value });
    };

    useDrag<{ startX: number; startWidth: number }>(ref, {
        onStart: (event) => {
            return {
                startX: event.clientX,
                startWidth: columnWidth
            };
        },
        onDrag: (event, { startX, startWidth }) => {
            const width = startWidth + event.clientX - startX;
            dispatch({ type: ActionType.SET_COLUMN_WIDTH, col, width });
        }
    });

    return (
        <div className="datagrid-header" style={{ width: columnWidth }}>
            <div className="datagrid-header-content">
                {isEditing ? (
                    <span onClick={startEdit}>{ column.name }</span>
                ) : (
                    <InputEditor value={column.name} onValueChanged={onValueChanged}/>
                )}
            </div>
            <div ref={ref} className="datagrid-resizer"/>
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
    return (
        <div className="datagrid-header-group">
            { columns.map((column, index) => (
                <DataGridHeader
                    key={index}
                    col={index}
                    column={column}
                    columnWidth={columnWidths[index]}
                    dispatch={dispatch}
                />
            ))}
        </div>
    );
}

export const DataGridHeaderGroup = React.memo(DataGridHeaderGroupComponent);
