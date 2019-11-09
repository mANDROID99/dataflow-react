import React, { useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";

import { isPortConnectable } from "../helpers/portHelpers";
import { setPortDragTarget, clearPortDragTarget } from "../graphActions";
import { PortDrag } from "../../store/storeTypes";
import { TargetPort } from "../types/graphTypes";

type Props = {
    graphId: string;
    nodeId: string;
    portId: string;
    portType: string;
    portOut: boolean;
    portDrag: PortDrag | undefined;
    portTargets: TargetPort[] | undefined;
}

function GraphNodePortOverlay(props: Props): React.ReactElement | null {
    const { graphId, nodeId, portId, portType, portOut, portDrag, portTargets } = props;
    const dispatch = useDispatch();

    const isConnectable = useMemo(() => {
        return isPortConnectable(portDrag, portTargets, nodeId, portType, portOut);
    }, [portDrag, nodeId, portType, portOut, portTargets]);

    const onEnter = useCallback(() => {
        dispatch(setPortDragTarget(graphId, nodeId, portId));
    }, [dispatch, graphId, nodeId, portId]);

    const onExit = useCallback(() => {
        dispatch(clearPortDragTarget(graphId, nodeId, portId));
    }, [dispatch, graphId, nodeId, portId]);

    if (isConnectable) {
        return (
            <div className="graph-node-port-overlay"
                onMouseOver={onEnter}
                onMouseOut={onExit}
            />
        );

    } else {
        return null;
    }
}

export default React.memo(GraphNodePortOverlay);
