import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { selectPortDrag } from "../../../store/selectors";
import { PortState } from '../../GraphNodePortRefs';
import { endPortDrag } from '../../../store/actions';
import { plot } from './curveHelpers';
import { useContainerContext } from '../../graphContainerContext';

type DragConnectionProps = {
    container: React.RefObject<SVGGElement>;
    portOut: boolean;
    draggedPort: PortState;
}

function GraphDragConnection({ portOut, draggedPort, container }: DragConnectionProps) {
    const dispatch = useDispatch();
    const [drag, setDrag] = useState({ x: draggedPort.x, y: draggedPort.y });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const c = container.current;
            if (!c) return;

            const point = new DOMPoint(event.clientX, event.clientY)
                .matrixTransform(c.getScreenCTM()!.inverse());
                
            setDrag({
                x: point.x,
                y: point.y
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
    }, [container, dispatch]);

    const d = plot(draggedPort.x, draggedPort.y, drag.x, drag.y, portOut);
    return (
        <path className="ngraph-graph-connection-drag" d={d}/>
    );
}

type Props = {
    container: React.RefObject<SVGGElement>;
    parent?: string;
}

function GraphDragConnectionContainer({ parent, container }: Props) {
    const { ports } = useContainerContext();
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
            container={container}
        />
    );
}

export default React.memo(GraphDragConnectionContainer);
