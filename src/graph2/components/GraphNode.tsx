import React, { useContext, useState } from 'react';
import { GraphNode } from '../../graph/types/graphTypes';
import { graphContext } from './Graph';
import GraphNodeHeader from './GraphNodeHeader';
import GraphNodePorts from './GraphNodePorts';
import { useDrag } from '../helpers/useDrag';
import { useDispatch } from 'react-redux';
import { setNodePosition } from '../graphActions';

type Props = {
    nodeId: string;
    graphNode: GraphNode;
}

type Drag = {
    dx: number;
    dy: number;
}

function GraphNodeComponent(props: Props): React.ReactElement {
    const graphNode = props.graphNode;
    const nodeId = props.nodeId;

    const [drag, setDrag] = useState<Drag>();
    const dispatch = useDispatch();
    const { graphId, spec } = useContext(graphContext);
    const nodeSpec = spec.nodes[graphNode.type];

    const startDrag = useDrag({
        onDrag(drag) {
            setDrag(drag);
        },
        onEnd(drag) {
            const x = graphNode.x + drag.dx;
            const y = graphNode.y + drag.dy;
            setDrag(undefined);
            dispatch(setNodePosition(graphId, nodeId, x, y));
        }
    });

    let x = graphNode.x;
    let y = graphNode.y;

    if (drag) {
        x += drag.dx;
        y += drag.dy;
    }

    return (
        <div className="graph-node" onMouseDown={startDrag} style={{ left: x, top: y }}>
            <GraphNodeHeader spec={nodeSpec} nodeId={nodeId}/>
            <div className="graph-node-body">
                <GraphNodePorts
                    nodeId={nodeId}
                    portSpecs={nodeSpec?.ports.in ?? []}
                    portTargets={graphNode.ports.in}
                    portsOut={false}
                    nodeX={x}
                    nodeY={y}
                />
                <GraphNodePorts
                    nodeId={nodeId}
                    portSpecs={nodeSpec?.ports.out ?? []}
                    portTargets={graphNode.ports.out}
                    portsOut={true}
                    nodeX={x}
                    nodeY={y}
                />
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
