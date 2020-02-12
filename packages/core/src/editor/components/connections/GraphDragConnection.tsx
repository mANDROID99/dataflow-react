import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { selectPortDrag } from "../../../store/selectors";
import { PortState } from '../../GraphNodePortRefs';
import { endPortDrag } from '../../../store/actions';
import { plot } from './curveHelpers';
import { useGraphContext } from '../../graphEditorContext';

type DragConnectionProps = {
    containerRef: React.RefObject<SVGSVGElement>;
    portOut: boolean;
    draggedPort: PortState;
}

function GraphDragConnection(props: DragConnectionProps) {
    const { portOut, draggedPort, containerRef } = props;
    const dispatch = useDispatch();
    const [drag, setDrag] = useState({ x: draggedPort.x, y: draggedPort.y });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const container = document.getElementById('nodes-container');
            if (!container) return;

            const containerBounds = container.getBoundingClientRect();
            setDrag({
                x: event.clientX - containerBounds.left,
                y: event.clientY - containerBounds.top
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
    }, [dispatch, containerRef]);

    const d = plot(draggedPort.x, draggedPort.y, drag.x, drag.y, portOut);
    return (
        <path className="ngraph-graph-connection-drag" d={d}/>
    );
}

type Props = {
    containerRef: React.RefObject<SVGSVGElement>;
}

function GraphDragConnectionContainer(props: Props) {
    const { ports } = useGraphContext();
    const portDrag = useSelector(selectPortDrag);

    if (!portDrag) {
        return null;
    }

    const portState = ports.getPortState(portDrag.port);
    if (!portState) {
        return null;
    }

    return (
        <GraphDragConnection
            containerRef={props.containerRef}
            portOut={portDrag.port.portOut}
            draggedPort={portState}
        />
    );
}

export default React.memo(GraphDragConnectionContainer);
