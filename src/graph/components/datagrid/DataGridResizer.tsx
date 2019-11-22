import React, { Dispatch, useRef } from "react";
import { Action, ActionType } from './DataGrid';
import { useDrag } from "../../helpers/useDrag";
import { Column } from "./dataGridTypes";

type Props = {
    col: number;
    width: number;
    column: Column;
    dispatch: Dispatch<Action>;
}

export default function DataGridResizer({ col, width, column, dispatch }: Props): React.ReactElement {
    const ref = useRef<HTMLDivElement>(null);

    useDrag<{ startX: number; width: number; column: Column }>(ref, {
        onStart: (event) => {
            return {
                startX: event.clientX,
                width,
                column
            };
        },
        onDrag: (event, { startX, width, column }) => {
            const dx = event.clientX - startX;
            const w = Math.max(column.minWidth ?? 0, width + dx);
            dispatch({ type: ActionType.RESIZE_COLUMN, col, width: w });
        }
    });

    return (
        <div ref={ref} className="datagrid-resizer"/>
    );
}


