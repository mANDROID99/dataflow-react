import React, { useEffect, useRef, useMemo } from 'react';
import classNames from 'classnames';

import { useDrag } from '../../../utils/hooks/useDrag';
import { isPortConnectable, comparePortRefs, resolvePortColors } from '../../../utils/graph/portUtils';
import { PortRef, GraphActionType } from '../../../types/graphReducerTypes';
import { TargetPort } from '../../../types/graphTypes';
import { useGraphContext } from '../../graphEditorContext';
import Port from './Port';

type Props = {
    nodeId: string;
    nodeType: string;
    nodeX: number;
    nodeY: number;
    nodeWidth: number;
    portId: string;
    portOut: boolean;
    portDrag: PortRef | undefined;
    portDragTarget: PortRef | undefined;
    portTargets: TargetPort[] | undefined;
}

function getPortXOffset(elRef: React.RefObject<HTMLDivElement>): number {
    const el = elRef.current;
    return el ? el.offsetLeft : 0;
}

function getPortYOffset(elRef: React.RefObject<HTMLDivElement>): number {
    const el = elRef.current;
    return el ? el.offsetTop + el.clientHeight / 2 : 0;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeType, nodeX, nodeY, nodeWidth, portId, portOut, portDrag, portDragTarget } = props;
    const { graphConfig, dispatch } = useGraphContext();

    const portRef: PortRef = useMemo((): PortRef => ({
        nodeId, nodeType, portId, portOut
    }), [nodeId, nodeType, portId, portOut]);

    const elRef = useRef<HTMLDivElement>(null);

    // drag behaviour
    const startDrag = useDrag({
        onStart(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            dispatch({
                type: GraphActionType.BEGIN_PORT_DRAG,
                port: portRef,
                dragX: mouseX,
                dragY: mouseY
            });
        },
        onDrag(event) {
            const mouseX = event.clientX;
            const mouseY = event.clientY;

            dispatch({
                type: GraphActionType.UPDATE_PORT_DRAG,
                dragX: mouseX,
                dragY: mouseY
            });
        },
        onEnd() {
            dispatch({
                type: GraphActionType.END_PORT_DRAG
            });
        }
    });

    // mount / unmount the port
    useEffect(() => {
        return () => {
            dispatch({
                type: GraphActionType.CLEAR_PORT_POS,
                port: portRef
            });
        };
    }, [portRef, dispatch]);

    // update the port position
    useEffect(() => {
        const x = nodeX + getPortXOffset(elRef);
        const y = nodeY + getPortYOffset(elRef);

        dispatch({
            type: GraphActionType.SET_PORT_POS,
            port: portRef,
            x, y
        });
    }, [portRef, nodeX, nodeY, nodeWidth, dispatch]);

    // resolve the "colour" of the port
    const portColors: string[] = useMemo(() => resolvePortColors(graphConfig, portRef), [graphConfig, portRef]);

    // port can be connected to the current drag target
    const isConnectable = useMemo(() =>
        portDrag ? isPortConnectable(portDrag, portRef, graphConfig) : false,
    [portDrag, portRef, graphConfig]);

    // port is being dragged
    const isDragged = portDrag ? comparePortRefs(portDrag, portRef) : false;

    // port is the current drag taget
    const isDragTarget = portDragTarget ? comparePortRefs(portDragTarget, portRef) : false;

    // port is hidden when it is not a valid drag target
    const hidden = !isDragged && !!portDrag && !isConnectable;

    // port is a potential drag target
    const candidate = !isDragged && !!portDrag && !isDragTarget;

    /**
     * event handlers
     */

    const handleEnter = () => {
        if (isConnectable) {
            dispatch({
                type: GraphActionType.SET_PORT_DRAG_TARGET,
                port: portRef
            });
        }
    };

    const handleExit = () => {
        if (isConnectable) {
            dispatch({
                type: GraphActionType.CLEAR_PORT_DRAG_TARGET,
                port: portRef
            });
        }
    };

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button === 0) {
            startDrag(event.nativeEvent);
        }
    };

    function renderLabel(): React.ReactElement {
        return <div className="ngraph-node-port-label">{ portId }</div>;
    }

    return (
        <div ref={elRef} className="ngraph-node-port-container">
            <div
                className={classNames("ngraph-node-port", {
                    candidate,
                    hidden,
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

