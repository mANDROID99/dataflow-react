import React, { useContext, useRef, useLayoutEffect, useMemo } from 'react';
import classnames from 'classnames';

import { GraphActionType, PortDragState } from '../types/graphStateTypes';
import { Context } from '../graphContext';
import { createPortId, PortId, comparePortIds } from '../graphHelpers';
import { GraphPort } from '../types/graphTypes';

type Props = {
    nodeId: string;
    port: GraphPort | undefined;
    portName: string;
    portOut: boolean;
    portDrag: PortDragState | undefined;
}

function isConnected(port: GraphPort | undefined, portDrag: PortDragState | undefined, portId: PortId) {
    if (port) {
        return true;
    }

    if (portDrag) {
        if (comparePortIds(portDrag.startPort, portId)) {
            return true;
        }

        if (portDrag.targetPort && comparePortIds(portDrag.targetPort, portId)) {
            return true;
        }
    }

    return false;
}

function GraphNodePort({ nodeId, port, portName, portOut, portDrag }: Props) {
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

    const connected = isConnected(port, portDrag, portId);

    function handleMouseDown() {
        dispatch({ type: GraphActionType.PORT_DRAG_SET, port: portId });
        if (connected) {
            actions.onNodeConnectionRemoved(portId);
        }
    }

    function handleMouseOver() {
        dispatch({ type: GraphActionType.PORT_DRAG_TARGET_SET, port: portId });
    }

    function handleMouseOut() {
        dispatch({ type: GraphActionType.PORT_DRAG_TARGET_CLEAR, port: portId });
    }

    function renderLabel() {
        return <div className="graph-node-port-label">{portName}</div>
    }

    return (
        <div
            className={classnames("graph-node-port-group", { connected, 'out': portOut })}
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
