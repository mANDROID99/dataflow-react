import React, { useContext, useEffect, useRef } from 'react';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { graphContext } from './Graph';
import classNames from 'classnames';
import { useDrag } from '../helpers/useDrag';

type Props = {
    nodeId: string;
    nodeX: number;
    nodeY: number;
    targets: TargetPort[] | undefined;
    portSpec: GraphNodePortSpec;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { nodeId, nodeX, nodeY, portSpec, portOut, targets  } = props;
    const portId = portSpec.name;

    const { connections } = useContext(graphContext);
    const [drag, beginDrag] = useDrag();

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
            connections.updatePort(nodeId, portId, portOut, x, y, targets);
        }
    }, [nodeId, portId, portOut, nodeX, nodeY, targets, connections]);

    // update the drag connection
    useEffect(() => {
        const el =  portConnector.current;
        if (el && connections) {
            if (drag) {
                const sx = nodeX + el.offsetLeft;
                const sy = nodeY + el.offsetTop;
                const ex = drag.startX + drag.dx;
                const ey = drag.startY + drag.dy;
                connections.setDragConnection(sx, sy, ex, ey);
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
            </div>
            {portOut ? undefined : renderLabel()}
        </div>
    );
}

export default React.memo(GraphNodePort);
