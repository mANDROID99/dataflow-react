import React, { useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { graphContext } from './Graph';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { useDrag } from '../helpers/useDrag';
import { selectPortDrag } from '../selectors';
import { startPortDrag, updatePortDrag, endPortDrag, mountPort, unmountPort, setPortDragTarget, unsetPortDragTarget } from '../graphActions';
import { PortRef } from '../../store/storeTypes';
import { isPortConnectable, comparePortRefs } from '../helpers/portHelpers';

type Props = {
    nodeId: string;
    portTargets: TargetPort[] | undefined;
    portSpec: GraphNodePortSpec;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, portSpec, portOut, portTargets } = props;
    const portId = portSpec.name;

    const { graphId } = useContext(graphContext);
    const portDrag = useSelector(selectPortDrag(graphId));
    const dispatch = useDispatch();

    const portType = portSpec.type;
    const portRef: PortRef = useMemo((): PortRef => ({
        nodeId,
        portId,
        portOut,
        portType
    }), [nodeId, portId, portOut, portType]);

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

    // on mouse over the port overlay
    const onEnter = useCallback(() => {
        dispatch(setPortDragTarget(graphId, portRef));
    }, [graphId, portRef, dispatch]);

    // on mouse exit the port overlay
    const onExit = useCallback(() => {
        dispatch(unsetPortDragTarget(graphId, portRef));
    }, [graphId, portRef, dispatch]);

    const isConnectable = useMemo(() => {
        return isPortConnectable(portDrag, portTargets, portRef);
    }, [portDrag, portTargets, portRef]);

    const isDragTarget = useMemo(() => {
        return portDrag && portDrag.target ? comparePortRefs(portDrag.target, portRef) : false;
    }, [portDrag, portRef]);

    function renderLabel(): React.ReactElement {
        return <div className="graph-node-port-label">{ portSpec.name }</div>;
    }

    return (
        <div className={classNames("graph-node-port", { out: portOut, target: isDragTarget })}>
            {portOut ? renderLabel() : undefined}
            <div ref={wrapPortElRef} className="graph-node-port-wrap-connector">
                <div ref={portElRef} className="graph-node-port-connector"/>
                { isConnectable ? (
                    <div className="graph-node-port-overlay" onMouseOver={onEnter} onMouseOut={onExit}/>
                ) : undefined }
            </div>
            {portOut ? undefined : renderLabel()}
        </div>
    );
}

export default React.memo(GraphNodePort);
