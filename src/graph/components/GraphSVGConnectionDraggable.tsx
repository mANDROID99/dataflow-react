import React, { useEffect, useState, useContext } from "react"
import { Context } from "../graphContext";
import { GraphActionType } from "../types/graphStateTypes";

type Props = {
    sx: number;
    sy: number;
}

type Pos = {
    x: number;
    y: number;
}

export default function GraphSVGConnectionDraggable({ sx, sy }: Props) {
    const { dispatch } = useContext(Context);
    const [endPos, setEndPos] = useState<Pos>({ x: sx, y: sy });

    useEffect(() => {
        function onDrag(evt: MouseEvent) {
            const x = evt.clientX;
            const y = evt.clientY;
            setEndPos({ x, y });
        }

        function onDragEnd() {
            dispatch({ type: GraphActionType.END_PORT_DRAG });
        }

        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        return () => {
            window.removeEventListener('mousemove', onDrag);
            window.removeEventListener('mouseup', onDragEnd);
        }
    }, []);

    const d = `M${sx},${sy}L${endPos.x},${endPos.y}`;
    return <path className="graph-connection" d={d}/>
}
