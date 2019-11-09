import React, { useContext } from 'react';
import { GraphNode } from '../types/graphTypes';
import { graphContext } from './Graph';
import GraphNodeHeader from './GraphNodeHeader';
import GraphNodePorts from './GraphNodePorts';
import { useDrag } from '../helpers/useDrag';
import { useDispatch, useSelector } from 'react-redux';
import { startNodeDrag, updateNodeDrag, endNodeDrag } from '../graphActions';
import { selectNodeDrag } from '../selectors';

type Props = {
    nodeId: string;
    graphNode: GraphNode;
}

function GraphNodeComponent(props: Props): React.ReactElement {
    const { nodeId, graphNode } = props;
    const { graphId, spec } = useContext(graphContext);

    const dispatch = useDispatch();
    const nodeSpec = spec.nodes[graphNode.type];
    const drag = useSelector(selectNodeDrag(graphId));

    const startDrag = useDrag({
        onStart() {
            dispatch(startNodeDrag(graphId, nodeId));
        },
        onDrag(drag) {
            dispatch(updateNodeDrag(graphId, drag.dx, drag.dy));
        },
        onEnd() {
            dispatch(endNodeDrag(graphId));
        }
    });

    let x = graphNode.x;
    let y = graphNode.y;

    if (drag && drag.node === nodeId) {
        x += drag.dragX;
        y += drag.dragY;
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
                />
                <GraphNodePorts
                    nodeId={nodeId}
                    portSpecs={nodeSpec?.ports.out ?? []}
                    portTargets={graphNode.ports.out}
                    portsOut={true}
                />
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
