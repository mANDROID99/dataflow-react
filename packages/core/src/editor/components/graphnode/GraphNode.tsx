import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';

import { GraphNode } from '../../../types/graphTypes';
import { ContextMenuTarget, ContextMenuTargetType, NodeBounds } from '../../../types/storeTypes';

import GraphNodeField from './GraphNodeField';
import GraphNodePort from './GraphNodePort';
import { useGraphContext } from '../../graphEditorContext';
import { DragWidthState } from './GraphNodeDragHandle';
import GraphNodeHeader, { DragPosState } from './GraphNodeHeader';
import { selectNode, showContextMenu, updateNodeBounds } from '../../../store/actions';
import { selectNodeSelected } from '../../../store/selectors';
import { useGraphNodeCallbacks } from './useGraphNodeCallbacks';

type Props<Ctx> = {
    nodeId: string;
    node: GraphNode;
    context: Ctx;
}

function useCountChanges(deps: any[]): number {
    const ref = useRef(deps);
    const count = useRef(0);
    let changed = false;

    for (let i = 0, n = deps.length; i < n; i++) {
        if (ref.current[i] !== deps[i]) {
            ref.current[i] = deps[i];
            changed = true;
        }
    }

    if (changed) count.current++;
    return count.current;
}

function compareBounds(prev: NodeBounds, next: NodeBounds) {
    return prev.x === next.x && prev.y === next.y && prev.width === next.width && prev.height === next.height;
}

function GraphNodeComponent<Ctx, Params>(props: Props<Ctx>): React.ReactElement {
    const { nodeId, node, context } = props;
    const { graphConfig, params } = useGraphContext<Ctx, Params>();
    const dispatch = useDispatch();
    const containerRef = useRef<HTMLDivElement>(null);

    // drag-state. Track it in internal state so we only update the graph
    // when the mouse is released.
    const [dragPos, setDragPos] = useState<DragPosState>();
    const [dragWidth, setDragWidth] = useState<DragWidthState>();
    const selected = useSelector(selectNodeSelected(nodeId));

    const nodeType = node.type;
    const nodeConfig = graphConfig.nodes[nodeType];

    const handleMouseDownContainer = (event: React.MouseEvent) => {
        // stop the canvas from dragging when the node is selected
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
    const prev = useRef<GraphNode>();
    useEffect(() => {
        if (prev.current !== node) {
            nodeCallbacks.onChanged(prev.current, node);
            prev.current = node;
        }
    });

    let x = node.x;
    let y = node.y;
    let width = node.width;

    if (dragPos) {
        x = dragPos.x;
        y = dragPos.y;
    }

    if (dragWidth) {
        width = dragWidth.width;
    }

    const portNamesIn = Object.keys(nodeConfig.ports.in);
    const portNamesOut = Object.keys(nodeConfig.ports.out);
    const dimsChangedCount = useCountChanges([x, y, width, node.collapsed]);

    const prevBounds = useRef<NodeBounds>();
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            const x = container.offsetLeft;
            const y = container.offsetTop;
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            const next: NodeBounds = { x, y, width, height };

            if (prevBounds.current == null || !compareBounds(prevBounds.current, next)) {
                prevBounds.current = next;
                dispatch(updateNodeBounds(nodeId, x, y, width, height));
            }
        }
    });

    return (
        <div
            className={cn('ngraph-node', { selected })}
            style={{ left: x, top: y, width }}
            ref={containerRef}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDownContainer}
        >
            <div className="ngraph-node-ports">
                {portNamesIn.map((portName, index) => (
                    <GraphNodePort
                        key={index}
                        nodeId={nodeId}
                        nodeType={nodeType}
                        portName={portName}
                        portOut={false}
                        dimsChangedCount={dimsChangedCount}
                    />
                ))}
            </div>
            <div className="ngraph-node-body">
                <GraphNodeHeader
                    nodeId={nodeId}
                    graphNode={node}
                    graphNodeConfig={nodeConfig}
                    onDrag={setDragPos}
                    onDragWidth={setDragWidth}
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
                        dimsChangedCount={dimsChangedCount}
                    />
                ))}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeComponent);
