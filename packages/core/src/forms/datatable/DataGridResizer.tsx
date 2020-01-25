import React, { Dispatch } from "react";
import { useDrag } from "../../utils/hooks/useDrag";
import { ActionType, Action } from "./dataGridReducer";

const MIN_WIDTH = 50;

type Props = {
    col: number;
    width: number;
    dispatch: Dispatch<Action>;
}

export default function DataGridResizer(props: Props): React.ReactElement {
    const { col, width, dispatch } = props;

    const startDrag = useDrag<{ startX: number; startWidth: number }>({
        onStart: (event) => {
            const startWidth = width;
            return {
                startX: event.clientX,
                startWidth
            };
        },
        onDrag: (event, { startX, startWidth }) => {
            const dx = event.clientX - startX;
            let width = startWidth + dx;

            if (width < MIN_WIDTH) {
                width = MIN_WIDTH;
            }
            
            dispatch({ type: ActionType.RESIZE_COLUMN, col, width });
        }
    });

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button === 0) {
            event.stopPropagation();
            startDrag(event.nativeEvent);
        }
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            className="ngraph-datagrid-table-resizer"
        />
    );
}


