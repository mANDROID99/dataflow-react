import React, { useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';

import { graphContext } from './GraphEditor';
import { GraphNodePortConfig } from '../../types/graphConfigTypes';
import { TargetPort } from '../../types/graphTypes';
import { useDrag } from '../helpers/useDrag';
import { selectPortDrag } from '../selectors';
import { startPortDrag, updatePortDrag, endPortDrag, mountPort, unmountPort, setPortDragTarget, unsetPortDragTarget } from '../editorActions';
import { PortRef, StoreState } from '../../store/storeTypes';
import { isPortConnectable, comparePortRefs } from '../helpers/portHelpers';

type Props = {
    nodeId: string;
    nodeType: string;
    portTargets: TargetPort[] | undefined;
    portSpec: GraphNodePortConfig;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeType, portSpec, portOut, portTargets } = props;
    const portId = portSpec.name;

    const { graphId, graphSpec: spec } = useContext(graphContext);
    const { dragTarget, dragPort } = useSelector((state: StoreState) => {
        const drag = selectPortDrag(state, graphId);
        return {
            dragTarget: drag?.target,
            dragPort: drag?.port
        };
    }, shallowEqual);

    const dispatch = useDispatch();

    const portType = portSpec.type;
    const portTypeSpec = spec.portTypes[portType];
    const portRef: PortRef = useMemo((): PortRef => ({
        nodeId,
        portId,
        portOut,
        portType,
        nodeType
    }), [nodeId, nodeType, portId, portOut, portType]);

    const wrapElRef = useRef<HTMLDivElement>(null);
    const portElRef = useRef<HTMLDivElement>(null);

    useDrag(portElRef, {
        onStart(event) {
            const x = event.clientX;
            const y = event.clientY;
            dispatch(startPortDrag(graphId, portRef, x, y));
        },
        onDrag(event) {
            const x = event.clientX;
            const y = event.clientY;
            dispatch(updatePortDrag(graphId, x, y));
        },
        onEnd() {
            dispatch(endPortDrag(graphId));
        }
    });

    // mount / unmount the port
    useEffect(() => {
        const wrapEl = wrapElRef.current;
        if (wrapEl) {
            const xOff = wrapEl.offsetLeft;
            const yOff = wrapEl.offsetTop + wrapEl.clientHeight / 2;
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
    const connected = useMemo((): boolean => {
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
        <div ref={wrapElRef} className="graph-node-wrap-port">
            <div className={classNames("graph-node-port", { connected, out: portOut })}>
                { portOut ? undefined : renderLabel() }
                <div ref={portElRef} className="graph-node-port-connector" style={{ backgroundColor: portColor }}>
                    { isConnectable ? (
                        <div className="graph-node-port-overlay" onMouseOver={onEnter} onMouseOut={onExit}/>
                    ) : undefined }
                </div>
                { portOut ? renderLabel() : undefined }
               
            </div>
        </div>
    );
}

export default React.memo(GraphNodePort);
