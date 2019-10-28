import React, { useCallback, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { GraphNodeSpec } from '../types/graphSpecTypes';
import { GraphActionType, NodeState } from '../types/graphStateTypes';
import { GraphNode as GraphNodeT } from '../types/graphTypes';

import { Context } from '../graphContext';
import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';

library.add(faTimes);

type Props = {
    nodeId: string;
    node: GraphNodeT;
    nodeState: NodeState;
}

function GraphNode({ nodeId, node, nodeState }: Props) {
    const { dispatch, actions, spec } = useContext(Context);

    const drag = nodeState.drag;
    const dragging = nodeState.dragging;
    const onNodeChanged = actions.onNodeChanged;

    useEffect(() => {
        let x = node.x, y = node.y;

        function onDragged(evt: MouseEvent) {
            x += evt.movementX;
            y += evt.movementY;
            dispatch({ type: GraphActionType.UPDATE_NODE_DRAG, nodeId, x: x, y: y });
        }
    
        function onDragEnd(){
            dispatch({ type: GraphActionType.CLEAR_NODE_DRAG, nodeId });
            onNodeChanged(nodeId, { ...node, x: x, y: y });
        }

        if (dragging) {
            window.addEventListener('mousemove', onDragged);
            window.addEventListener('mouseup', onDragEnd);

            return () => {
                window.removeEventListener('mousemove', onDragged);
                window.removeEventListener('mouseup', onDragEnd);
            }
        }
    }, [dragging, node, nodeId, dispatch, onNodeChanged]);

    const onDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        dispatch({ type: GraphActionType.BEGIN_NODE_DRAG, nodeId });
    }, [dispatch, nodeId]);

    const left: number = drag ? drag.x : node.x;
    const top: number  = drag ? drag.y : node.y;

    const nodeSpec: GraphNodeSpec = spec.nodes[node.type];
    const portsIn = nodeSpec.portsIn;
    const portsOut = nodeSpec.portsOut;
    const fields = nodeSpec.fields;

    return (
        <div className="graph-node" onMouseDown={onDragStart} style={{ left, top }}>
            <div className="graph-node-header">
                <div className="graph-node-title">
                    { node.title }
                </div>
                <div className="graph-node-close" onClick={() => actions.onNodeRemoved(nodeId)}>
                    <FontAwesomeIcon icon="times"/>
                </div>
            </div>
            <div className="graph-node-body">
                <div className="graph-node-ports">
                    {portsIn.map((port, i) => (
                        <GraphNodePort
                            key={i}
                            nodeId={nodeId}
                            portSpec={port}
                            portIn={false}
                            portName={port.name}
                        />
                    ))}
                </div>
                <div className="graph-node-fields">
                    {fields.map((field, i) => {
                        return (
                            <GraphNodeField
                                key={i}
                                nodeId={nodeId}
                                field={field}
                                value={node.values[field.name]}
                            />
                        )
                    })}                    
                </div>
                <div className="graph-node-ports">
                    {portsOut.map((port, i) => (
                        <GraphNodePort
                            key={i}
                            nodeId={nodeId}
                            portSpec={port}
                            portIn={true}
                            portName={port.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(GraphNode);
