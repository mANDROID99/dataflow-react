import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { GraphNode } from '../../../types/graphTypes';
import { ContextMenuTarget, ContextMenuTargetType, NodeBounds } from '../../../types/storeTypes';

import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';
import { useGraphContext } from '../../graphEditorContext';
import GraphNodeHeader from './GraphNodeHeader';
import { selectNode, showContextMenu, setNodeBounds, moveOverlapping } from '../../../store/actions';
import { selectNodeSelected } from '../../../store/selectors';
import { useGraphNodeCallbacks } from './useGraphNodeCallbacks';

type Props<Ctx> = {
    nodeId: string;
    node: GraphNode;
    context: Ctx;
}

function GraphNodeComponent<Ctx, Params>(props: Props<Ctx>): React.ReactElement {
    const { nodeId, node, context } = props;
    const { graphConfig, params } = useGraphContext<Ctx, Params>();

    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);
    const selected = useSelector(selectNodeSelected(nodeId));

    const nodeType = node.type;
    const nodeConfig = graphConfig.nodes[nodeType];

    const handleMouseDownContainer = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (!selected) {
            dispatch(selectNode(nodeId));
        }
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

    // callback functions to call from inner components
    const nodeCallbacks = useGraphNodeCallbacks(nodeId, node, nodeConfig, context, params, dispatch);

    // notify when the graph-node changed
    const prevNode = useRef<GraphNode>();
    useEffect(() => {
        if (prevNode.current !== node) {
            nodeCallbacks.onChanged(prevNode.current, node);
            prevNode.current = node;
        }
    });

    // Compute element bounds. If changed, update in the store
    const prevBounds = useRef<NodeBounds>();
    useEffect(() => {
        const container = containerRef.current;
        if (!container || node.dragging) return;

        const x = container.offsetLeft;
        const y = container.offsetTop;
        const w = container.offsetWidth;
        const h = container.offsetHeight;

        if (!prevBounds.current ||
            prevBounds.current.x !== x || prevBounds.current.y !== y || prevBounds.current.width !== w || prevBounds.current.height !== h
        ) {
            prevBounds.current = { x, y, width: w, height: h };
            dispatch(setNodeBounds(nodeId, x, y, w, h));
        }
    });

    // move nodes overlapping with this one when the node is collapsed / expanded
    const prevCollapsed = useRef(node.collapsed);
    useEffect(() => {
        if (prevCollapsed.current !== node.collapsed) {
            prevCollapsed.current = node.collapsed;
            dispatch(moveOverlapping(nodeId));
        }
    });

    const x = node.x;
    const y = node.y;
    const width = node.width;

    const portNamesIn = Object.keys(nodeConfig.ports.in);
    const portNamesOut = Object.keys(nodeConfig.ports.out);
    
    return (
        <div
            className={cn('ngraph-node', { selected })}
            style={{
                left: x,
                top: y,
                width
            }}
            ref={containerRef}
            onContextMenu={handleContextMenu}
            onClick={handleMouseDownContainer}
        >
            <div className="ngraph-node-ports">
                {portNamesIn.map((portName, index) => (
                    <GraphNodePort
                        key={index}
                        nodeId={nodeId}
                        nodeType={nodeType}
                        portName={portName}
                        portOut={false}
                    />
                ))}
            </div>
            <div className="ngraph-node-body">
                <GraphNodeHeader
                    nodeId={nodeId}
                    graphNode={node}
                    graphNodeConfig={nodeConfig}
                />
                {!node.collapsed && (
                    <div className="ngraph-node-fields">
                        {Object.entries(nodeConfig.fields).map(([fieldName, fieldConfig]) => {
                            return (
                                <GraphNodeField<Ctx, Params>
                                    key={fieldName}
                                    nodeId={nodeId}
                                    context={context}
                                    fieldName={fieldName}
                                    fieldConfig={fieldConfig}
                                    callbacks={nodeCallbacks}
                                    fields={node.fields}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="ngraph-node-ports out">
                {portNamesOut.map((portName, index) => (
                    <GraphNodePort
                        key={index}
                        nodeId={nodeId}
                        nodeType={nodeType}
                        portName={portName}
                        portOut={true}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
