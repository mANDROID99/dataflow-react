import React, { useContext, useRef, useLayoutEffect } from 'react';
import classnames from 'classnames';

import { GraphActionType } from '../types/graphStateTypes';
import { Context } from '../graphContext';
import { createPortId } from '../graphHelpers';
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

        const port = createPortId(nodeId, portName, portOut);

        dispatch({ type: GraphActionType.PORT_MOUNT, port, offX, offY });
        return () => {
            dispatch({ type: GraphActionType.PORT_UNMOUNT, port });
        }

    }, [nodeId, portName, portOut, dispatch]);

    const connected = port != null;

    function handleMouseDown() {
        const port = createPortId(nodeId, portName, portOut);
        dispatch({ type: GraphActionType.PORT_DRAG_SET, port });

        if (connected) {
            actions.onNodeConnectionRemoved(port);
        }
    }

    function handleMouseOver() {
        const port = createPortId(nodeId, portName, portOut);
        dispatch({ type: GraphActionType.PORT_DRAG_TARGET_SET, port });
    }

    function handleMouseOut() {
        const port = createPortId(nodeId, portName, portOut);
        dispatch({ type: GraphActionType.PORT_DRAG_TARGET_CLEAR, port });
    }

    function renderLabel() {
        return <div className="graph-node-port-label">{portName}</div>
    }

    return (
        <div className={classnames("graph-node-port-group", { connected })}>
            { portOut ? renderLabel() : undefined }
            <div
                ref={portEl}
                className="graph-node-port"
                onMouseDown={handleMouseDown}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            />
            { portOut ? undefined : renderLabel() }
        </div>
    );
}

export default React.memo(GraphNodePort);
