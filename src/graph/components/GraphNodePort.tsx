import React, { useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';

import { graphContext } from './Graph';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { useDrag } from '../helpers/useDrag';
import { selectPortDrag } from '../selectors';
import { startPortDrag, updatePortDrag, endPortDrag, mountPort, unmountPort, setPortDragTarget, unsetPortDragTarget } from '../graphActions';
import { PortRef, StoreState } from '../../store/storeTypes';
import { isPortConnectable, comparePortRefs } from '../helpers/portHelpers';

type Props = {
    nodeId: string;
    nodeType: string;
    portTargets: TargetPort[] | undefined;
    portSpec: GraphNodePortSpec;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeType, portSpec, portOut, portTargets } = props;
    const portId = portSpec.name;

    const { graphId, spec } = useContext(graphContext);
    const { dragTarget, dragPort } = useSelector((state: StoreState) => {
        const drag = selectPortDrag(state, graphId);
        return {
            dragTarget: drag?.target,
            dragPort: drag?.port
        };
    }, shallowEqual);

    const dispatch = useDispatch();

    const portType = portSpec.type;
    const portTypeSpec = spec.types[portType];
    const portRef: PortRef = useMemo((): PortRef => ({
        nodeId,
        portId,
        portOut,
        portType,
        nodeType
    }), [nodeId, nodeType, portId, portOut, portType]);

    const wrapPortElRef = useRef<HTMLDivElement>(null);
    const portElRef = useRef<HTMLDivElement>(null);

    useDrag(portElRef, {
        onStart(drag) {
            dispatch(startPortDrag(graphId, portRef, drag.startX, drag.startY));
        },
        onDrag(drag) {
            const x = drag.startX + drag.dx;
            const y = drag.startY + drag.dy;
            dispatch(updatePortDrag(graphId, x, y));
        },
        onEnd() {
            dispatch(endPortDrag(graphId));
        }
    });

    // mount / unmount the port
    useEffect(() => {
        const el = wrapPortElRef.current;
        if (el) {
            const xOff = el.offsetLeft;
            const yOff = el.offsetTop;
            dispatch(mountPort(graphId, portRef, xOff, yOff));
            return (): void => {
                dispatch(unmountPort(graphId, portRef));
            };
        }
    }, [graphId, portRef, dispatch]);

    // determines whether this port can be connected to port being dragged
    const isConnectable = useMemo(() => {
        return isPortConnectable(dragPort, portTargets, portRef, portSpec);
    }, [dragPort, portTargets, portRef, portSpec]);

    // on mouse over the port overlay
    const onEnter = useCallback(() => {
        if (isConnectable) {
            dispatch(setPortDragTarget(graphId, portRef));
        }
    }, [graphId, portRef, isConnectable, dispatch]);

    // on mouse exit the port overlay
    const onExit = useCallback(() => {
        dispatch(unsetPortDragTarget(graphId, portRef));
    }, [graphId, portRef, dispatch]);

    // whether the port is "connected" to another port in the graph, or is the current drag-target.
    const isConnected = useMemo((): boolean => {
        if (portTargets != null && portTargets.length > 0) {
            return true;

        } else if (dragPort && comparePortRefs(dragPort, portRef)) {
            return dragTarget != null;

        } else if (dragTarget && comparePortRefs(dragTarget, portRef)) {
            return true;

        } else {
            return false;
        }
    }, [portTargets, dragPort, dragTarget, portRef]);

    function renderLabel(): React.ReactElement {
        return <div className="graph-node-port-label">{ portSpec.name }</div>;
    }

    const portColor = portTypeSpec?.color;
    return (
        <div className={classNames("graph-node-port", { out: portOut, connected: isConnected })}>
            {portOut ? renderLabel() : undefined}
            <div ref={wrapPortElRef} className="graph-node-port-wrap-connector">
                <div ref={portElRef} className="graph-node-port-connector" style={{ backgroundColor: portColor }}/>
                { isConnectable ? (
                    <div className="graph-node-port-overlay" onMouseOver={onEnter} onMouseOut={onExit}/>
                ) : undefined }
            </div>
            {portOut ? undefined : renderLabel()}
        </div>
    );
}

export default React.memo(GraphNodePort);
