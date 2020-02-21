import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { selectPortDrag } from "../../../store/selectors";
import { PortState } from '../../GraphNodePortRefs';
import { endPortDrag } from '../../../store/actions';
import { plot } from './curveHelpers';
import { useContainerContext, Pos } from '../../graphContainerContext';

type DragConnectionProps = {
    portOut: boolean;
    draggedPort: PortState;
    scrollOffset: React.MutableRefObject<Pos>;
}

function GraphDragConnection({ portOut, draggedPort, scrollOffset }: DragConnectionProps) {
    const dispatch = useDispatch();
    const [drag, setDrag] = useState({ x: draggedPort.x, y: draggedPort.y });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setDrag({
                x: event.clientX - scrollOffset.current.x,
                y: event.clientY - scrollOffset.current.y
            });
        };

        const handleMouseUp = () => {
            dispatch(endPortDrag());
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dispatch, scrollOffset]);

    const d = plot(draggedPort.x, draggedPort.y, drag.x, drag.y, portOut);
    return (
        <path className="ngraph-graph-connection-drag" d={d}/>
    );
}

type Props = {
    parent?: string;
}

function GraphDragConnectionContainer({ parent }: Props) {
    const { ports, scrollOffset } = useContainerContext();
    const portDrag = useSelector(selectPortDrag);

    if (!portDrag || portDrag.port.parentNodeId !== parent) {
        return null;
    }

    const portState = ports.getPortState(portDrag.port);
    if (!portState) {
        return null;
    }

    return (
        <GraphDragConnection
            portOut={portDrag.port.portOut}
            draggedPort={portState}
            scrollOffset={scrollOffset}
        />
    );
}

export default React.memo(GraphDragConnectionContainer);
