import React, { useEffect, useRef, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';

import { GraphNode } from '../../../types/graphTypes';
import GraphNodePort from './GraphNodePort';
import { useGraphContext } from '../../graphEditorContext';
import { selectNodeSelected } from '../../../store/selectors';
import { GraphNodeComponentProps } from '../../../types/graphConfigTypes';
import { selectNode, showContextMenu, setNodeBounds, moveOverlapping } from '../../../store/actions';
import { ContextMenuTarget, ContextMenuTargetType, NodeBounds } from '../../../types/storeTypes';
import { useGraphNodeActions } from './graphNodeActions';
import { useDragBehaviour } from '../../../utils/hooks/useDragBehaviour';
import GraphNodeComponent from './GraphNodeComponent';
import { getNodeMinWidth, getNodeMaxWidth, getNodeMinHeight, getNodeMaxHeight } from '../../../utils/graph/graphNodeFactory';

type Props<Ctx> = {
    nodeId: string;
    node: GraphNode;
    context: Ctx;
}

function clamp(x: number, min: number | undefined, max: number | undefined): number {
    if (min != null && x < min) {
        return min;
    }

    if (max != null && x > max) {
        return max;
    }

    return x;
}

function GraphNodeContainer<Ctx, Params>({ nodeId, node, context }: Props<Ctx>): React.ReactElement {
    const { graphConfig, params } = useGraphContext<Ctx, Params>();
    const selected = useSelector(selectNodeSelected(nodeId));
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const nodeType = node.type;
    const nodeConfig = graphConfig.nodes[nodeType];
    const minW = getNodeMinWidth(nodeConfig);
    const maxW = getNodeMaxWidth(nodeConfig);
    const minH = getNodeMinHeight(nodeConfig);
    const maxH = getNodeMaxHeight(nodeConfig);

    // construct the actions to pass down
    const actions = useGraphNodeActions(nodeId, dispatch, nodeConfig, node, context, params);

    // notify when the graph-node changed
    const prevNode = useRef<GraphNode>(node);
    useEffect(() => {
        if (prevNode.current !== node && nodeConfig.onChanged) {
            actions.triggerNodeChanged(prevNode.current, node);
        }
    });

    // drag-pos behaviour
    const [dragPos, handleDragPos] = useDragBehaviour({
        onDragEnd(dx, dy) {
            if (dx !== 0 || dy !== 0) {
                actions.setPos(node.x + dx, node.y + dy);
            }
        }
    });

    // drag-size behaviour
    const [dragSize, handleDragSize] = useDragBehaviour({
        onDragEnd(dw, dh) {
            if (dw !== 0 || dh !== 0) {
                let w = node.width + dw;
                w = clamp(w, minW, maxW);

                let h = node.height + dh;
                h = clamp(h, minH, maxH);

                actions.setSize(w, h);
            }
        }
    });

    // drag-widh behaviour
    const [dragWidth, handleDragWidth] = useDragBehaviour({
        onDragEnd(dw) {
            if (dw !== 0) {
                let w = node.width + dw;
                w = clamp(w, minW, maxW);
                actions.setWidth(w);
            }
        }
    });

    // resolve the new position
    let x = node.x;
    let y = node.y;

    if (dragPos) {
        x += dragPos.dx;
        y += dragPos.dy;
    }

    let width = node.width;
    let height = node.height;

    if (dragSize) {
        width += dragSize.dx;
        height += dragSize.dy;
    }

    if (dragWidth) {
        width += dragWidth.dx;
    }

    // clamp the size between the allowed bounds
    width = clamp(width, minW, maxW);
    height = clamp(height, minH, maxH);

    // whether anything is currently affecting the node bounds
    const isDragging = dragPos != null || dragSize != null;

    // Detect element measured bounds changes, update in the store
    const prevBounds = useRef<NodeBounds>();
    useEffect(() => {
        const el = ref.current;
        if (!el || isDragging) return;

        const x = el.offsetLeft;
        const y = el.offsetTop;
        const w = el.offsetWidth;
        const h = el.offsetHeight;

        if (!prevBounds.current ||
            prevBounds.current.x !== x || prevBounds.current.y !== y || prevBounds.current.width !== w || prevBounds.current.height !== h
        ) {
            prevBounds.current = { x, y, width: w, height: h };
            dispatch(setNodeBounds(nodeId, x, y, w, h));
        }
    });

    // move nodes overlapping when collapsed / expanded
    const prevCollapsed = useRef(node.collapsed);
    useEffect(() => {
        if (prevCollapsed.current !== node.collapsed) {
            prevCollapsed.current = node.collapsed;
            dispatch(moveOverlapping(nodeId));
        }
    });

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

    const renderPorts = (portOut: boolean) => {
        const portNames = Object.keys(portOut ? nodeConfig.ports.out : nodeConfig.ports.in);
        return (
            <div className="ngraph-node-ports">
                {portNames.map((portName, index) => (
                      <GraphNodePort
                        key={index}
                        nodeId={nodeId}
                        nodeType={nodeType}
                        portName={portName}
                        portOut={portOut}
                    /> 
                ))}
            </div>
        );
    };

    const componentProps: GraphNodeComponentProps<Ctx, Params> = {
        nodeId,
        node,
        nodeConfig,
        selected,
        context,
        params,
        actions,
        width,
        height,
        handleDragPos,
        handleDragSize,
        handleDragWidth
    };

    const renderBody = () => {
        if (nodeConfig.component) {
            return React.createElement(nodeConfig.component, componentProps);
        } else {
            return <GraphNodeComponent {...componentProps}/>;
        }
    };

    return (
        <div
            className={cn('ngraph-node', { selected })}
            style={{ left: x, top: y }}
            ref={ref}
            onContextMenu={handleContextMenu}
            onClick={handleMouseDownContainer}
        >
            {renderPorts(false)}
            {renderBody()}
            {renderPorts(true)}
        </div>
    );
}

export default React.memo(GraphNodeContainer);
