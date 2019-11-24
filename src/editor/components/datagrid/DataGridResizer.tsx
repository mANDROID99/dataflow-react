import React, { Dispatch, useRef } from "react";
import { Action, ActionType } from './DataGrid';
import { useDrag } from "../../helpers/useDrag";
import { Column } from "./dataGridTypes";

type Props = {
    col: number;
    column: Column;
    dispatch: Dispatch<Action>;
}

export default function DataGridResizer({ col, column, dispatch }: Props): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    useDrag<{ startX: number; column: Column }>(ref, {
        onStart: (event) => {
            return {
                startX: event.clientX,
                column
            };
        },
        onDrag: (event, { startX, column }) => {
            const dx = event.clientX - startX;
            const w = Math.max(column.minWidth ?? 0, column.width + dx);
            dispatch({ type: ActionType.RESIZE_COLUMN, col, width: w });
        }
    });

    return (
        <div ref={ref} className="datagrid-resizer"/>
    );
}


