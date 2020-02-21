import React, { useEffect, useRef, useMemo } from 'react';
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
import { useContainerContext } from '../../graphContainerContext';

type InnerProps = Props & {
    parentNodeId: string | undefined;
}

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

function createPortTarget(nodeType: string, nodeId: string, parentNodeId: string | undefined, portName: string, portOut: boolean, portConfig: GraphNodePortConfig | undefined): PortTarget {
    const connectMulti: boolean = portConfig?.multi ?? false;
    return {
        nodeType,
        parentNodeId,
        nodeId,
        portName,
        portOut,
        connectMulti,
    };
}

function GraphNodePort(props: InnerProps, ref: React.Ref<HTMLDivElement>): React.ReactElement {
    const { nodeId, parentNodeId, nodeType, portName, portOut } = props;
    const dispatch = useDispatch();
    
    // resolve the config for the port
    const { graphConfig } = useGraphContext();
    const portConfig = getPortConfig(graphConfig, nodeType, portName, portOut);

    // port target is how the port will be referred to in the store
    const portTarget = useMemo(() => {
        return createPortTarget(nodeType,nodeId, parentNodeId, portName, portOut, portConfig);
    }, [nodeType, nodeId, parentNodeId, portName, portOut, portConfig]);

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
        <div ref={ref} className="ngraph-node-port-container">
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

const PortInner = React.memo(React.forwardRef<HTMLDivElement, InnerProps>(GraphNodePort));

export default function GraphNodePortContainer(props: Props) {
    const { nodeId, portName, portOut } = props;
    const ref = useRef<HTMLDivElement>(null);
    const { ports, scrollOffset, parentNodeId } = useContainerContext();

    // notify the port connections that the port position has changed
    const prev = useRef<{ x: number; y: number }>();
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const portId = { nodeId: props.nodeId, portName: props.portName, portOut: props.portOut };
        const bounds = el.getBoundingClientRect();

        // compute the position relative to the scroll container
        const x = bounds.left + bounds.width / 2 - scrollOffset.current.x;
        const y = bounds.top + bounds.height / 2 - scrollOffset.current.y;

        // check that the port state is changed
        if (!prev.current || prev.current.x !== x || prev.current.y !== y) {
            prev.current = { x, y };
            ports.setPortState(portId, prev.current);
        }
    });

    // mount / unmount the port
    useEffect(() => {
        return () => {
            ports.clearPortState({ nodeId, portName, portOut });
        };
    }, [nodeId, portName, portOut, ports]);

    return <PortInner ref={ref} {...props} parentNodeId={parentNodeId}/>;
}
