import React, { useCallback, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { GraphNodeSpec } from '../types/graphSpecTypes';
import { GraphNode } from '../types/graphTypes';

import { Context } from '../graphContext';
import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';
import { GraphActionType } from '../types/graphStateTypes';

library.add(faTimes);

type Props = {
    nodeId: string;
    node: GraphNode;
    isDragging: boolean;
    dragX?: number;
    dragY?: number;
}

function GraphNodeComponent({ nodeId, node, isDragging, dragX, dragY }: Props) {
    const { dispatch, actions, spec } = useContext(Context);
    const onNodePosChanged = actions.onNodePosChanged;

    useEffect(() => {
        let x = node.x, y = node.y;

        function onDragged(evt: MouseEvent) {
            x += evt.movementX;
            y += evt.movementY;
            dispatch({ type: GraphActionType.UPDATE_DRAG, dragX: x, dragY: y });
        }
    
        function onDragEnd(){
            dispatch({ type: GraphActionType.END_DRAG });
            onNodePosChanged(nodeId, x, y);
        }

        if (isDragging) {
            window.addEventListener('mousemove', onDragged);
            window.addEventListener('mouseup', onDragEnd);

            return () => {
                window.removeEventListener('mousemove', onDragged);
                window.removeEventListener('mouseup', onDragEnd);
            }
        }
    }, [isDragging, node, nodeId, dispatch, onNodePosChanged]);

    const onDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target;
        if (target != null && (target as HTMLElement).className === 'graph-node') {
            dispatch({ type: GraphActionType.START_DRAG, nodeId });
        }
    }, [dispatch, nodeId]);

    const left: number = dragX != null ? dragX : node.x;
    const top: number  = dragY != null ? dragY : node.y;

    const nodeSpec: GraphNodeSpec = spec.nodes[node.type];
    const portsIn = nodeSpec.ports.in;
    const portsOut = nodeSpec.ports.out;
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
                            portOut={false}
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
                                value={node.fields[field.name]}
                            />
                        )
                    })}                    
                </div>
                <div className="graph-node-ports">
                    {portsOut.map((port, i) => (
                        <GraphNodePort
                            key={i}
                            nodeId={nodeId}
                            portOut={true}
                            portName={port.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
