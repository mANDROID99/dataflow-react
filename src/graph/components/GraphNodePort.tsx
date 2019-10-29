import React, { useContext, useCallback, useRef, useEffect } from 'react';

import { GraphActionType } from '../types/graphStateTypes';
import { Context } from '../graphContext';
import { getPortId } from '../graphHelpers';

type Props = {
    nodeId: string;
    portName: string;
    portOut: boolean;
}

function GraphNodePort({ nodeId, portName, portOut }: Props) {
    const { dispatch } = useContext(Context);
    const portEl = useRef<HTMLDivElement>(null);

    useEffect(() => {
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

    const handleMouseDown = useCallback(() => {
        dispatch({ type: GraphActionType.START_PORT_DRAG, nodeId, portOut, portName })
    }, [dispatch, nodeId, portOut, portName]);

    function renderLabel() {
        return <div className="graph-node-port-label">{portName}</div>
    }

    return (
        <div className="graph-node-port-group">
            { portOut ? renderLabel() : undefined }
            <div ref={portEl} className="graph-node-port" onMouseDown={handleMouseDown}/>
            { portOut ? undefined : renderLabel() }
        </div>
    );
}

export default React.memo(GraphNodePort);
