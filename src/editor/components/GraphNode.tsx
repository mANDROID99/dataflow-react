import React, { useContext, useRef } from 'react';
import { GraphNode } from '../types/graphTypes';
import { graphContext } from './GraphEditor';
import GraphNodeHeader from './GraphNodeHeader';
import GraphNodePorts from './GraphNodePorts';
import { useDrag } from '../helpers/useDrag';
import { useDispatch, useSelector } from 'react-redux';
import { startNodeDrag, updateNodeDrag, endNodeDrag } from '../editorActions';
import { selectNodeDrag } from '../selectors';
import GraphNodeFields from './GraphNodeFields';

type Props = {
    nodeId: string;
    graphNode: GraphNode;
}

function GraphNodeComponent(props: Props): React.ReactElement {
    const { nodeId, graphNode } = props;
    const { graphId, graphSpec } = useContext(graphContext);

    const dispatch = useDispatch();
    const nodeType = graphNode.type;
    const nodeSpec = graphSpec.nodes[nodeType];
    const drag = useSelector(selectNodeDrag(graphId));

    const elRef = useRef<HTMLDivElement>(null);
    useDrag<{ startX: number; startY: number }>(elRef, {
        onStart(event) {
            dispatch(startNodeDrag(graphId, nodeId));
            return {
                startX: event.clientX,
                startY: event.clientY
            };
        },
        onDrag(event, drag) {
            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;
            dispatch(updateNodeDrag(graphId, dx, dy));
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
        <div className="graph-node" style={{ left: x, top: y }}>
            <div ref={elRef} className="graph-node-header">
                <GraphNodeHeader spec={nodeSpec} nodeId={nodeId}/>
            </div>
            <div className="graph-node-body">
                <GraphNodePorts
                    nodeId={nodeId}
                    nodeType={nodeType}
                    portSpecs={nodeSpec?.ports.in ?? []}
                    portTargets={graphNode.ports.in}
                    portsOut={false}
                />
                <GraphNodeFields
                    nodeId={nodeId}
                    fieldSpecs={nodeSpec?.fields}
                    fieldValues={graphNode.fields}
                />
                <GraphNodePorts
                    nodeId={nodeId}
                    nodeType={nodeType}
                    portSpecs={nodeSpec?.ports.out ?? []}
                    portTargets={graphNode.ports.out}
                    portsOut={true}
                />
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
