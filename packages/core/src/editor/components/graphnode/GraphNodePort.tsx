import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';

import { GraphConfig, GraphNodePortConfig } from '../../../types/graphConfigTypes';
import { PortTarget } from '../../../types/storeTypes';

import { useDrag } from '../../../utils/hooks/useDrag';
import { isPortConnectable, comparePortTargets, resolvePortColors, getPortConfig } from '../../../utils/graph/portUtils';
import { useGraphContext } from '../../graphEditorContext';
import { beginPortDrag, updatePortDrag, endPortDrag, setPortPos, clearPortPos, setPortDragTarget, clearPortDragTarget } from '../../../store/actions';
import { selectPortDrag } from '../../../store/selectors';
import Port from './Port';

type Props = {
    nodeId: string;
    nodeType: string;
    portName: string;
    portOut: boolean;
    x: number;
    y: number;
    w: number;
}

function getPortXOffset(elRef: React.RefObject<HTMLDivElement>): number {
    const el = elRef.current;
    return el ? el.offsetLeft : 0;
}

function getPortYOffset(elRef: React.RefObject<HTMLDivElement>): number {
    const el = elRef.current;
    return el ? el.offsetTop + el.clientHeight / 2 : 0;
}

/**
 * Constructs a memoized selector for the port state
 */
function createPortStateSelector(graphConfig: GraphConfig<any, any>, port: PortTarget) {
    return createSelector(selectPortDrag, (dragState) => {
        let isConnectable = false;
        let isDragged = false;
        let isDragTarget = false;
        let isHidden = false;
        let isDragCandidate = false;
        
        if (dragState) {
            // is the current port connectable?
            isConnectable = isPortConnectable(dragState.port, port, graphConfig);

            // is the current port the drag target?
            if (dragState.target) {
                isDragTarget = comparePortTargets(dragState.target, port);
            }

            // is the current port being dragged?
            isDragged = comparePortTargets(dragState.port, port);

             // is the port hidden, because it is not a valid target?
            isHidden = !isDragged && !isConnectable;

            // is the port a potential drag target?
            isDragCandidate = !isDragged && !isDragTarget;
        }

        return {
            isConnectable,
            isDragged,
            isDragTarget,
            isHidden,
            isDragCandidate
        };
    });
}

function createPortTarget(nodeId: string, nodeType: string, portName: string, portOut: boolean, portConfig?: GraphNodePortConfig): PortTarget {
    const connectMulti: boolean = portConfig?.multi ?? false;

    return {
        nodeId,
        nodeType,
        portName,
        portOut,
        connectMulti
    };
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeType, x, y, w, portName, portOut } = props;
    const dispatch = useDispatch();
    const elRef = useRef<HTMLDivElement>(null);
    
    // resolve the config for the port
    const { graphConfig } = useGraphContext();
    const portConfig = getPortConfig(graphConfig, nodeType, portName, portOut);

    // port target is how the port will be referred to in the store
    const portTarget = useMemo(() => {
        return createPortTarget(nodeId, nodeType, portName, portOut, portConfig);
    }, [nodeId, nodeType, portName, portOut, portConfig]);

    // drag behaviour
    const startDrag = useDrag({
        onStart(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            dispatch(beginPortDrag(portTarget, mouseX, mouseY));
        },
        onDrag(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            dispatch(updatePortDrag(mouseX, mouseY));
        },
        onEnd() {
            dispatch(endPortDrag());
        }
    });

    // mount / unmount the port
    useEffect(() => {
        return () => {
            dispatch(clearPortPos(portTarget));
        };
    }, [portTarget, dispatch]);

    // update the port position in the store
    useEffect(() => {
        const portX = x + getPortXOffset(elRef);
        const portY = y + getPortYOffset(elRef);
        dispatch(setPortPos(portTarget, portX, portY));
    }, [portTarget, x, y, w, dispatch]);

    // select the current node "state" from the store
    const selector = useMemo(() => createPortStateSelector(graphConfig, portTarget), [graphConfig, portTarget]);
    const {
        isConnectable,
        isHidden,
        isDragCandidate
    } = useSelector(selector, shallowEqual);

    // resolve the port colour
    const portColors: string[] = useMemo(() => resolvePortColors(graphConfig, portTarget), [graphConfig, portTarget]);

    /**
     * event handlers
     */

    const handleEnter = () => {
        if (isConnectable) {
            dispatch(setPortDragTarget(portTarget));
        }
    };

    const handleExit = () => {
        if (isConnectable) {
            dispatch(clearPortDragTarget(portTarget));
        }
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button === 0) {
            startDrag(event.nativeEvent);
        }
    };

    function renderLabel(): React.ReactElement {
        return <div className="ngraph-node-port-label">{ portName }</div>;
    }

    return (
        <div ref={elRef} className="ngraph-node-port-container">
            <div
                className={classNames("ngraph-node-port", {
                    candidate: isDragCandidate,
                    hidden: isHidden,
                    out: portOut
                })}
                onMouseDown={handleMouseDown}
                onMouseOver={handleEnter}
                onMouseOut={handleExit}
            >
                { portOut ? undefined : renderLabel() }
                <Port colors={portColors}/>
                { portOut ? renderLabel() : undefined }
            </div>
        </div>
    );
}

export default React.memo(GraphNodePort);

