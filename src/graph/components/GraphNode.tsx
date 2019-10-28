import React, { useCallback, useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { GraphNode as GraphNodeT, GraphNodeSpec } from '../graphTypes';
import { Context } from '../graphContext';
import { batch } from 'react-redux';
import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';

library.add(faTimes);

type Props = {
    nodeId: string;
    node: GraphNodeT;
    // state: NodeState | undefined;
}

type DragState = {
    x: number;
    y: number;
}

function GraphNode({ nodeId, node }: Props) {
    const [isDragging, setDragging] = useState(false);
    const [dragState, setDragState] = useState<DragState | undefined>(undefined);

    const { dispatch, actions, spec } = useContext(Context);
    const onNodePosChanged = actions.onNodePosChanged;

    useEffect(() => {
        let x = node.x, y = node.y;

        function onDragged(evt: MouseEvent) {
            x += evt.movementX;
            y += evt.movementY;
            setDragState({ x, y });
        }
    
        function onDragEnd(){
            batch(() => {
                onNodePosChanged(nodeId, x, y);
                setDragging(false);
            });
        }

        if (isDragging) {
            window.addEventListener('mousemove', onDragged);
            window.addEventListener('mouseup', onDragEnd);

            return () => {
                window.removeEventListener('mousemove', onDragged);
                window.removeEventListener('mouseup', onDragEnd);
            }
        }
    }, [isDragging, node]);

    const onDragStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
    }, []);

    const left: number = dragState ? dragState.x : node.x;
    const top: number  = dragState ? dragState.y : node.y;

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
                            portOut={false}
                            port={node.portsIn[port.name]}
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
                            portOut={true}
                            port={node.portsOut[port.name]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(GraphNode);
