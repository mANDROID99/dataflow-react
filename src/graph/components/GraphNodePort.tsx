import React, { useContext, useRef, useLayoutEffect, useMemo } from 'react';
import classnames from 'classnames';

import { GraphActionType, PortDragState } from '../types/graphStateTypes';
import { Context } from '../graphContext';
import { createPortId, PortId, comparePortIds } from '../graphHelpers';
import { GraphPort } from '../types/graphTypes';
import { GraphNodePortSpec } from '../types/graphSpecTypes';

type Props = {
    nodeId: string;
    port: GraphPort | undefined;
    portSpec: GraphNodePortSpec;
    portName: string;
    portOut: boolean;
    portDrag: PortDragState | undefined;
}

function isConnected(port: GraphPort | undefined, portDrag: PortDragState | undefined, portId: PortId) {
    if (port) {
        return true;
    }

    if (portDrag && portDrag.portType) {
        if (comparePortIds(portDrag.startPort, portId)) {
            return true;
        }

        if (portDrag.targetPort && comparePortIds(portDrag.targetPort, portId)) {
            return true;
        }
    }

    return false;
}

function isConnectable(portDrag: PortDragState, nodeId: string, portOut: boolean, portType: string) {
    const start = portDrag.startPort;
    return (
        portDrag.portType === portType &&
        start.nodeId !== nodeId &&
        start.portOut !== portOut
    ); 
}

function GraphNodePort({ nodeId, port, portSpec, portName, portOut, portDrag }: Props) {
    const { dispatch, actions } = useContext(Context);
    const portEl = useRef<HTMLDivElement>(null);

    const portId = useMemo(() => {
        return createPortId(nodeId, portName, portOut);
    }, [nodeId, portName, portOut])

    useLayoutEffect(() => {
        const el = portEl.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const offX = el.offsetLeft + rect.width / 2;
        const offY = el.offsetTop + rect.height / 2;

        const port = createPortId(nodeId, portName, portOut);

        dispatch({ type: GraphActionType.PORT_MOUNT, port, offX, offY });
        return () => {
            dispatch({ type: GraphActionType.PORT_UNMOUNT, port });
        }

    }, [nodeId, portName, portOut, dispatch]);

    const portType = portSpec.type;
    const connected = isConnected(port, portDrag, portId);
    const connectable = portDrag ? isConnectable(portDrag, nodeId, portOut, portType) : false;

    function handleMouseDown() {
        dispatch({ type: GraphActionType.PORT_DRAG_START, port: portId, portType });
        if (connected) {
            actions.onNodeConnectionRemoved(portId);
        }
    }

    function handleMouseOver() {
        if (connectable) {
            dispatch({ type: GraphActionType.PORT_DRAG_TARGET_SET, port: portId });
        }
    }

    function handleMouseOut() {
        if (connectable) {
            dispatch({ type: GraphActionType.PORT_DRAG_TARGET_CLEAR, port: portId });
        }
    }

    function renderLabel() {
        return <div className="graph-node-port-label">{portName}</div>
    }

    return (
        <div
            className={classnames("graph-node-port-group", { connected, connectable, 'out': portOut })}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            { portOut ? renderLabel() : undefined }
            <div ref={portEl} className="graph-node-port" onMouseDown={handleMouseDown}/>
            { portOut ? undefined : renderLabel() }
        </div>
    );
}

export default React.memo(GraphNodePort);
