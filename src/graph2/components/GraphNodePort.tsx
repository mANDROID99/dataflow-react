import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';

import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { graphContext } from './Graph';
import { useDrag } from '../helpers/useDrag';
import { selectPortDrag } from '../selectors';
import { startPortDrag, clearPortDrag, clearPortConnections, addPortConnection } from '../graphActions';
import GraphNodePortOverlay from './GraphNodePortOverlay';

type Props = {
    nodeId: string;
    nodeX: number;
    nodeY: number;
    portTargets: TargetPort[] | undefined;
    portSpec: GraphNodePortSpec;
    portOut: boolean;
}

type DragState = {
    x: number;
    y: number;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeX, nodeY, portSpec, portOut, portTargets } = props;
    const portId = portSpec.name;

    const { graphId, connections } = useContext(graphContext);
    const portDrag = useSelector(selectPortDrag(graphId));
    const dispatch = useDispatch();
    const [drag, setDrag] = useState<DragState>();

    // port drag behaviour
    const beginDrag = useDrag({
        onStart() {
            // on port drag begin
            dispatch(startPortDrag(graphId, nodeId, portId, portOut, portSpec.type));
            if (!portOut) {
                dispatch(clearPortConnections(graphId, nodeId, portId, portOut));
            }
        },
        onDrag(drag) {
            // on port drag updated
            const x = drag.startX + drag.dx;
            const y = drag.startY + drag.dy;
            setDrag({ x, y });
        },
        onEnd() {
            // on port drag ended
            setDrag(undefined);
            dispatch(clearPortDrag(graphId));
            if (portDrag && portDrag.target) {
                const target = portDrag.target;
                dispatch(addPortConnection(graphId, nodeId, portId, portOut, target.nodeId, target.portId));
            }
        }
    });

    function renderLabel(): React.ReactElement {
        return <div className="graph-node-port-label">{ portSpec.name }</div>;
    }

    // mount / unmount the port
    const portConnector = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (connections) {
            connections.mountPort(nodeId, portId, portOut, 0, 0);
            return (): void => {
                connections.unmountPort(nodeId, portId, portOut);
            };
        }
    }, [nodeId, portId, portOut, connections]);

    // update the connections to and from this port
    useEffect(() => {
        const el =  portConnector.current;
        if (el && connections) {
            const x = nodeX + el.offsetLeft;
            const y = nodeY + el.offsetTop;
            connections.updatePort(nodeId, portId, portOut, x, y, portTargets);
        }
    }, [nodeId, portId, portOut, nodeX, nodeY, portTargets, connections]);

    // update the drag connection
    useEffect(() => {
        const el =  portConnector.current;
        if (el && connections) {
            if (drag) {
                const sx = nodeX + el.offsetLeft;
                const sy = nodeY + el.offsetTop;
                connections.setDragConnection(sx, sy, drag.x, drag.y);
            } else {
                connections.clearDragConnection();
            }
        }
    }, [drag, nodeX, nodeY, connections]);

    return (
        <div className={classNames("graph-node-port", { out: portOut })}>
            {portOut ? renderLabel() : undefined}
            <div ref={portConnector} className="graph-node-port-wrap-connector">
                <div className="graph-node-port-connector" onMouseDown={beginDrag}/>
                <GraphNodePortOverlay
                    graphId={graphId}
                    nodeId={nodeId}
                    portId={portId}
                    portType={portSpec.type}
                    portOut={portOut}
                    portDrag={portDrag}
                    portTargets={portTargets}
                />
            </div>
            {portOut ? undefined : renderLabel()}
        </div>
    );
}

export default React.memo(GraphNodePort);
