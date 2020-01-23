import React, { useState } from 'react';
import cn from 'classnames';

import { GraphNode } from '../../../types/graphTypes';
import { GraphActionType, PortRef, ContextMenuTarget, ContextMenuTargetType } from '../../../types/graphReducerTypes';
import { GraphNodeContext } from '../../../types/graphFieldInputTypes';
import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';
import { useGraphContext } from '../../graphEditorContext';
import { DragWidthState } from './GraphNodeDragHandle';
import GraphNodeHeader, { DragPosState } from './GraphNodeHeader';

type Props<Ctx, Params> = {
    nodeId: string;
    nodeContext: GraphNodeContext<Ctx, Params>;
    selected: boolean;
    graphNode: GraphNode;
    portDragPort: PortRef | undefined;
    portDragTarget: PortRef | undefined;
}

function GraphNodeComponent<Ctx, Params>(props: Props<Ctx, Params>): React.ReactElement {
    const { nodeId, graphNode, nodeContext, selected, portDragPort, portDragTarget } = props;
    const { graphConfig, dispatch } = useGraphContext<Ctx, Params>();

    // drag-state. Track it in internal state so we only update the graph
    // when the mouse is released.
    const [dragPos, setDragPos] = useState<DragPosState>();
    const [dragWidth, setDragWidth] = useState<DragWidthState>();

    const nodeType = graphNode.type;
    const nodeConfig = graphConfig.nodes[nodeType];

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({ type: GraphActionType.SELECT_NODE, nodeId });
    };

    const handleMouseDownContainer = (event: React.MouseEvent) => {
        // stop the canvas from dragging when the node is selected
        event.stopPropagation();
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
        dispatch({ type: GraphActionType.SHOW_CONTEXT_MENU, x, y, target });
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

    const portNamesIn = Object.keys(nodeConfig.ports.in);
    const portNamesOut = Object.keys(nodeConfig.ports.out);

    return (
        <div
            className={cn('ngraph-node', { selected })}
            style={{ left: x, top: y, width }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDownContainer}
        >
            <GraphNodeHeader
                 nodeId={nodeId}
                 dispatch={dispatch}
                 nodeX={graphNode.x}
                 nodeY={graphNode.y}
                 nodeWidth={graphNode.width}
                 nodeConfig={nodeConfig}
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
                            nodeX={x}
                            nodeY={y}
                            nodeWidth={0}
                            portId={portName}
                            portOut={false}
                            portDrag={portDragPort}
                            portDragTarget={portDragTarget}
                            portTargets={graphNode.ports.in[portName]}
                        />
                    ))}
                </div>
                <div className="ngraph-node-fields">
                    {Object.entries(nodeConfig.fields).map(([fieldName, fieldConfig]) => {
                        const fieldValue = graphNode.fields[fieldName];
                        return (
                            <GraphNodeField
                                key={fieldName}
                                nodeId={nodeId}
                                nodeContext={nodeContext}
                                fieldName={fieldName}
                                fieldConfig={fieldConfig}
                                fieldValue={fieldValue}
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
                            nodeX={x}
                            nodeY={y}
                            nodeWidth={width}
                            portId={portName}
                            portOut={true}
                            portDrag={portDragPort}
                            portDragTarget={portDragTarget}
                            portTargets={graphNode.ports.out[portName]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
