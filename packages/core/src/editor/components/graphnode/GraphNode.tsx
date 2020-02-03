import React, { useState } from 'react';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { GraphNode } from '../../../types/graphTypes';
import { ContextMenuTarget, ContextMenuTargetType } from '../../../types/storeTypes';

import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';
import { useGraphContext } from '../../graphEditorContext';
import { DragWidthState } from './GraphNodeDragHandle';
import GraphNodeHeader, { DragPosState } from './GraphNodeHeader';
import { selectNode, showContextMenu } from '../../../store/actions';
import { selectNodeSelected } from '../../../store/selectors';
import { ComputedNode } from '../../../types/graphInputTypes';

type Props<Ctx> = {
    nodeId: string;
    graphNode: GraphNode;
    nodeComputed: ComputedNode<Ctx>;
}

function GraphNodeComponent<Ctx, Params>(props: Props<Ctx>): React.ReactElement {
    const { nodeId, graphNode, nodeComputed } = props;
    const { graphConfig } = useGraphContext<Ctx, Params>();
    const dispatch = useDispatch();

    // drag-state. Track it in internal state so we only update the graph
    // when the mouse is released.
    const [dragPos, setDragPos] = useState<DragPosState>();
    const [dragWidth, setDragWidth] = useState<DragWidthState>();
    const selected = useSelector(selectNodeSelected(nodeId));

    const nodeType = graphNode.type;
    const graphNodeConfig = graphConfig.nodes[nodeType];

    const handleMouseDownContainer = (event: React.MouseEvent) => {
        // stop the canvas from dragging when the node is selected
        event.stopPropagation();
        dispatch(selectNode(nodeId));
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const x = event.clientX;
        const y = event.clientY;

        const target: ContextMenuTarget = {
            type: ContextMenuTargetType.GRAPH_NODE,
            nodeId
        };

        dispatch(showContextMenu(target, x, y));
    };

    let x = graphNode.x;
    let y = graphNode.y;
    let width = graphNode.width;

    if (dragPos) {
        x = dragPos.x;
        y = dragPos.y;
    }

    if (dragWidth) {
        width = dragWidth.width;
    }

    const portNamesIn = Object.keys(graphNodeConfig.ports.in);
    const portNamesOut = Object.keys(graphNodeConfig.ports.out);

    return (
        <div
            className={cn('ngraph-node', { selected })}
            style={{ left: x, top: y, width }}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDownContainer}
        >
            <GraphNodeHeader
                 nodeId={nodeId}
                 graphNode={graphNode}
                 graphNodeConfig={graphNodeConfig}
                 onDrag={setDragPos}
                 onDragWidth={setDragWidth}
            />
            <div className="ngraph-node-body">
                <div className="ngraph-node-ports">
                    {portNamesIn.map((portName, index) => (
                        <GraphNodePort
                            key={index}
                            nodeId={nodeId}
                            nodeType={nodeType}
                            portName={portName}
                            portOut={false}
                            nodeX={x}
                            nodeY={y}
                            nodeWidth={0}
                        />
                    ))}
                </div>
                <div className="ngraph-node-fields">
                    {Object.entries(graphNodeConfig.fields).map(([fieldName, fieldConfig]) => {
                        return (
                            <GraphNodeField
                                key={fieldName}
                                nodeId={nodeId}
                                fieldName={fieldName}
                                fieldConfig={fieldConfig}
                                fieldComputed={nodeComputed.fields[fieldName]}
                            />
                        );
                    })}
                </div>
                <div className="ngraph-node-ports">
                    {portNamesOut.map((portName, index) => (
                        <GraphNodePort
                            key={index}
                            nodeId={nodeId}
                            nodeType={nodeType}
                            portName={portName}
                            portOut={true}
                            nodeX={x}
                            nodeY={y}
                            nodeWidth={width}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
