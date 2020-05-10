import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { PortDragState } from "../../types/storeTypes";
import { selectPortPos, selectPortDragTargetPos } from "../../redux/editorSelectors";
import { plotConnection, Pos } from './plot';
import { endPortDrag } from '../../redux/editorActions';

type Props = {
    portDrag: PortDragState;
}

export default function GraphDragConnection({ portDrag }: Props) {
    const dispatch = useDispatch();
    const startPos = useSelector(selectPortPos(portDrag.nodeId, portDrag.portId, portDrag.portOut));
    const targetPos = useSelector(selectPortDragTargetPos);
    const [mousePos, setMousePos] = useState<Pos>();

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            setMousePos([e.clientX, e.clientY]);
        };

        const onMouseUp = () => {
            dispatch(endPortDrag());
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }, [dispatch]);

    if (!startPos || !mousePos) return null;

    let d: string;
    if (targetPos) {
        d = plotConnection(startPos, targetPos.x, targetPos.y, targetPos.align);
    } else {
        d = plotConnection(startPos, mousePos[0], mousePos[1]);
    }

    return <path className="ngraph-connection" d={d}/>;
}

