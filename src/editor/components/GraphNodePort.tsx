import React, { useContext, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';

import { graphContext } from './GraphEditor';
import { useDrag } from '../helpers/useDrag';
import { selectPortDrag, selectPortTargets } from '../selectors';
import { startPortDrag, updatePortDrag, endPortDrag, mountPort, unmountPort, setPortDragTarget, unsetPortDragTarget } from '../editorActions';
import { PortRef, StoreState } from '../../types/storeTypes';
import { isPortConnectable, comparePortRefs } from '../helpers/portHelpers';

type Props = {
    nodeId: string;
    portId: string;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, portId, portOut } = props;

    const { graphId, graphConfig } = useContext(graphContext);
    const { dragTarget, dragPort } = useSelector((state: StoreState) => {
        const drag = selectPortDrag(state, graphId);
        return {
            dragTarget: drag?.target,
            dragPort: drag?.port
        };
    }, shallowEqual);

    const dispatch = useDispatch();
    const portRef: PortRef = useMemo((): PortRef => ({
        nodeId,
        portId,
        portOut
    }), [nodeId, portId, portOut]);

    const wrapElRef = useRef<HTMLDivElement>(null);
    const portElRef = useRef<HTMLDivElement>(null);

    // drag behaviour
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

    // whether this port can be connected to the dragged port
    const isConnectable = useSelector((state: StoreState) => {
        const editor = state.editor[graphId];
        return editor && dragPort ? isPortConnectable(dragPort, portRef, editor.graph, graphConfig) : false;
    });

    // whether the port is connected to another port in the graph
    const isConnected = useSelector((state: StoreState) => {
        const ports = selectPortTargets(state, graphId, nodeId, portId, portOut);
        return ports != null && ports.length > 0;
    });

    // whether the port is the current drag-target
    const isDragged = dragPort ? comparePortRefs(dragPort, portRef) : false;
    const isTargetted = dragTarget ? comparePortRefs(dragTarget, portRef) : false;


    // event handlers

    const onEnter = useCallback(() => {
        if (isConnectable) {
            dispatch(setPortDragTarget(graphId, portRef));
        }
    }, [graphId, portRef, isConnectable, dispatch]);

    const onExit = useCallback(() => {
        dispatch(unsetPortDragTarget(graphId, portRef));
    }, [graphId, portRef, dispatch]);

    function renderLabel(): React.ReactElement {
        return <div className="graph-node-port-label">{ portId }</div>;
    }

    // const portColor = portTypeSpec?.color;
    return (
        <div ref={wrapElRef} className="graph-node-wrap-port">
            <div className={classNames("graph-node-port", { connected: isConnected || isDragged || isTargetted, out: portOut })}>
                { portOut ? undefined : renderLabel() }
                {/* <div ref={portElRef} className="graph-node-port-connector" style={{ backgroundColor: portColor }}> */}
                <div ref={portElRef} className="graph-node-port-connector">
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
