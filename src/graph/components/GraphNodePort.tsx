import React, { useContext, useCallback, useRef, useLayoutEffect } from 'react';
import classnames from 'classnames';

import { GraphActionType } from '../types/graphStateTypes';
import { Context } from '../graphContext';
import { getPortId } from '../graphHelpers';
import { GraphPort } from '../types/graphTypes';

type Props = {
    nodeId: string;
    port: GraphPort | undefined;
    portName: string;
    portOut: boolean;
}

function GraphNodePort({ nodeId, port, portName, portOut }: Props) {
    const { dispatch, actions } = useContext(Context);
    const portEl = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = portEl.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const offX = el.offsetLeft + rect.width / 2;
        const offY = el.offsetTop + rect.height / 2;

        const portId = getPortId(nodeId, portOut, portName);

        dispatch({ type: GraphActionType.MOUNT_PORT, portId, offX, offY });
        return () => {
            dispatch({ type: GraphActionType.UNMOUNT_PORT, portId });
        }

    }, [nodeId, portName, portOut, dispatch]);

    const connected = port != null;

    function handleMouseDown() {
        dispatch({ type: GraphActionType.START_PORT_DRAG, nodeId, portOut, portName });
        if (connected) {
            actions.onNodeConnectionCleared(nodeId, portName, portOut);
        }
    }

    function renderLabel() {
        return <div className="graph-node-port-label">{portName}</div>
    }

    return (
        <div className={classnames("graph-node-port-group", { connected })}>
            { portOut ? renderLabel() : undefined }
            <div ref={portEl} className="graph-node-port" onMouseDown={handleMouseDown}/>
            { portOut ? undefined : renderLabel() }
        </div>
    );
}

export default React.memo(GraphNodePort);
