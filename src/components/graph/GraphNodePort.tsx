import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PortAlign, PortDef } from '../../types/graphDefTypes';
import { beginPortDrag, setPortDragPos, unmountPort, setPortDragTarget, clearPortDragTarget, mountPort } from '../../redux/editorActions';
import { selectPortDragStatus, DragStatus } from '../../redux/editorSelectors';
import { useEditorContext } from '../editorContext';

const PORT_GAP = 15;
const PORT_DISTANCE = 10;
const LABEL_DISTANCE = 10;

type Props = {
    nodeId: string;
    portId: string;
    portOut: boolean;
    portDef: PortDef;
    align: PortAlign;
    index: number;
    n: number;
    nodeWidth: number;
    nodeHeight: number;
}

function renderPortLabel(pos: PortAlign, label: string) {
    let x: number = 0;
    let y: number = 0;
    let vertical = false;
    let textAnchor: 'end' | undefined;

    switch(pos) {
        case PortAlign.LEFT: {
            x = -LABEL_DISTANCE;
            textAnchor = 'end';
            break;
        }
        case PortAlign.RIGHT: {
            x = LABEL_DISTANCE;
            break;
        }
        case PortAlign.TOP: {
            y = -LABEL_DISTANCE;
            vertical = true;
            textAnchor = 'end';
            break;
        }
        case PortAlign.BOTTOM: {
            y = LABEL_DISTANCE;
            vertical = true;
        }
    }

    let transform: string;
    if (vertical) {
        transform = `translate(${x},${y}) rotate(90)`;
    } else {
        transform = `translate(${x},${y})`;
    }

    return (
        <text
            transform={transform}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className="ngraph-node-port-label"
        >
            {label}
        </text>
    );
}

function resolvePortPos(align: PortAlign, nodeWidth: number, nodeHeight: number, index: number, n: number) {
    const vertical = align === PortAlign.TOP || align === PortAlign.BOTTOM;
    let x: number;
    let y: number;

    if (vertical) {
        x = nodeWidth / 2 + (index - (n - 1) / 2) * PORT_GAP;

        if (align === PortAlign.TOP) {
            y = -PORT_DISTANCE;
        } else {
            y = nodeHeight + PORT_DISTANCE;
        }

    } else {
        y = nodeHeight / 2 + (index - (n - 1) / 2) * PORT_GAP;

        if (align === PortAlign.LEFT) {
            x = -PORT_DISTANCE;
        } else {
            x = nodeWidth + PORT_DISTANCE;
        }
    }

    return [x, y];
}

function classNameFromDragStatus(dragStatus: DragStatus) {
    switch (dragStatus) {
        case DragStatus.DRAGGING:
            return ' dragging';
        case DragStatus.DRAG_TARGET:
            return ' drag-target'
        case DragStatus.CANDIDATE:
            return ' drag-candidate';
        case DragStatus.NON_CANDIDATE:
            return ' drag-hidden';
    }
}

export default function GraphNodePort({ nodeId, portId, portOut, portDef, align, index, n, nodeWidth, nodeHeight }: Props) {
    const { graphDef } = useEditorContext();
    const dispatch = useDispatch();
    const dragStatus = useSelector(selectPortDragStatus(graphDef, nodeId, portId, portOut));

    const [x, y] = resolvePortPos(align, nodeWidth, nodeHeight, index, n);

    const prevRef = useRef({ x, y, align });
    useEffect(() => {
        const prev = prevRef.current;
        dispatch(mountPort(nodeId, portId, portOut, prev.align, prev.x, prev.y));
        return () => {
            dispatch(unmountPort(nodeId, portId, portOut));
        }
    }, [dispatch, nodeId, portId, portOut]);

    useEffect(() => {
        const pos = prevRef.current;
        if (pos.x !== x || pos.y !== y || pos.align !== align) {
            prevRef.current = { x, y, align };
            dispatch(setPortDragPos(nodeId, portId, portOut, align, x, y));
        }
    }, [dispatch, nodeId, portId, portOut, align, x, y]);

    const handleMouseDown = () => {
        dispatch(beginPortDrag(nodeId, portId, portOut));
    };

    const handleMouseOver = () => {
        if (dragStatus === DragStatus.CANDIDATE) {
            dispatch(setPortDragTarget(nodeId, portId, portOut));
        }
    };

    const handleMouseOut = () => {
        if (dragStatus === DragStatus.DRAG_TARGET) {
            dispatch(clearPortDragTarget(nodeId, portId, portOut));
        }
    };

    let className = 'ngraph-node-port';
    const cn = classNameFromDragStatus(dragStatus);
    if (cn) className += cn;

    return (
        <g className={className} transform={`translate(${x},${y})`}>
            <circle
                onMouseDown={handleMouseDown}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
                className="ngraph-node-port-handle"
                r={5}
            />
            {portDef.label && renderPortLabel(align, portDef.label)}
        </g>
    );
}
