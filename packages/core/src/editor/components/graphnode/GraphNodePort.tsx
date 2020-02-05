import React, { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { createSelector } from 'reselect';
import classNames from 'classnames';

import { GraphConfig, GraphNodePortConfig } from '../../../types/graphConfigTypes';
import { PortTarget } from '../../../types/storeTypes';

import { isPortConnectable, comparePortTargets, resolvePortColors, getPortConfig } from '../../../utils/graph/portUtils';
import { useGraphContext } from '../../graphEditorContext';
import { beginPortDrag, setPortDragTarget, clearPortDragTarget } from '../../../store/actions';
import { selectPortDrag } from '../../../store/selectors';
import GraphNodePortHandle from './GraphNodePortHandle';

type Props = {
    nodeId: string;
    nodeType: string;
    portName: string;
    portOut: boolean;
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

function createPortTarget(nodeType: string, nodeId: string, portName: string, portOut: boolean, portConfig?: GraphNodePortConfig): PortTarget {
    const connectMulti: boolean = portConfig?.multi ?? false;

    return {
        nodeType,
        nodeId,
        portName,
        portOut,
        connectMulti
    };
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeType, portName, portOut } = props;
    const dispatch = useDispatch();
    const elRef = useRef<HTMLDivElement>(null);
    
    // resolve the config for the port
    const { graphConfig, ports } = useGraphContext();
    const portConfig = getPortConfig(graphConfig, nodeType, portName, portOut);

    // port target is how the port will be referred to in the store
    const portTarget = useMemo(() => {
        return createPortTarget(nodeType, nodeId, portName, portOut, portConfig);
    }, [nodeType, nodeId, portName, portOut, portConfig]);

    // mount / unmount the port
    useEffect(() => {
        return () => {
            ports.clearPortState({ nodeId, portName, portOut });
        };
    }, [nodeId, portName, portOut, ports]);

    // update the port position
    useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const rootContainer = document.getElementById('ngraph-scroller');
        if (!rootContainer) return;

        const portId = { nodeId, portName, portOut };
        const parentBounds = rootContainer.getBoundingClientRect();
        const bounds = el.getBoundingClientRect();
        const x = bounds.left - parentBounds.left + bounds.width / 2;
        const y = bounds.top - parentBounds.top + bounds.height / 2;
        ports.setPortState(portId, { x, y });
    });

    // select the current node state from the store
    const selector = useMemo(() => createPortStateSelector(graphConfig, portTarget), [graphConfig, portTarget]);
    const { isConnectable, isHidden, isDragCandidate } = useSelector(selector, shallowEqual);

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
            dispatch(beginPortDrag(portTarget));
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
                <GraphNodePortHandle colors={portColors}/>
                { portOut ? renderLabel() : undefined }
            </div>
        </div>
    );
}

export default GraphNodePort;

