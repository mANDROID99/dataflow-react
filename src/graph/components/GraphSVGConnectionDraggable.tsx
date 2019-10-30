import React, { useEffect, useState, useContext, useRef } from "react"
import { Context } from "../graphContext";
import { GraphActionType, PortDragState } from "../types/graphStateTypes";
import classNames from "classnames";

type Props = {
    sx: number;
    sy: number;
    drag: PortDragState;
}

type Pos = {
    x: number;
    y: number;
}

export default function GraphSVGConnectionDraggable({ sx, sy, drag }: Props) {
    const { dispatch, actions } = useContext(Context);
    const [endPos, setEndPos] = useState<Pos>({ x: sx, y: sy });
    const onNodeConnectionCreated = actions.onNodeConnectionCreated;

    const dragRef = useRef(drag);
    dragRef.current = drag;

    useEffect(() => {
        function onDrag(evt: MouseEvent) {
            const x = evt.clientX;
            const y = evt.clientY;
            setEndPos({ x, y });
        }

        function onDragEnd() {
            // cancel the current drag
            dispatch({ type: GraphActionType.PORT_DRAG_END });

            // create a connection in the store
            const drag = dragRef.current;
            if (drag.targetPort) {
                onNodeConnectionCreated(drag.startPort, drag.targetPort);
            }
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        }
    }, [onNodeConnectionCreated, dispatch]);

    const connected = drag.targetPort != null;
    const d = `M${sx},${sy}L${endPos.x},${endPos.y}`;
    return <path className={classNames("graph-connection", { connected })} d={d}/>
}
