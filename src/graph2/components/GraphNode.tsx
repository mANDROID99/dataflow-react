import React, { useContext } from 'react';
import { GraphNode } from '../../graph/types/graphTypes';
import { graphContext } from './Graph';
import GraphNodeHeader from './GraphNodeHeader';
import GraphNodePorts from './GraphNodePorts';
import { useDrag } from '../helpers/useDrag';

type Props = {
    nodeId: string;
    graphNode: GraphNode;
}

function GraphNodeComponent(props: Props): React.ReactElement {
    const graphNode = props.graphNode;
    const nodeId = props.nodeId;

    const { actions, spec } = useContext(graphContext);
    const nodeSpec = spec.nodes[graphNode.type];

    const [drag, startDrag] = useDrag({
        onEnd(dx, dy) {
            const x = graphNode.x + dx;
            const y = graphNode.y + dy;
            actions.setNodePosition(nodeId, x, y);
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
            <GraphNodeHeader spec={nodeSpec}/>
            <div className="graph-node-body">
                <GraphNodePorts portsOut={false}/>
                <GraphNodePorts portsOut={true}/>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
