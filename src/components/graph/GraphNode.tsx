import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectGraphNode } from "../../redux/editorSelectors";
import { useEditorContext } from "../editorContext";
import GraphNodePorts from "./GraphNodePorts";
import { useDrag } from "../../utils/useDrag";
import { setNodePos, setNodeDragPos, unmountNode, mountNode, showConfigModal } from "../../redux/editorActions";
import { throwUnrecognizedNodeType } from "../../utils/errors";
import { resolveNodeDims } from "../../utils/dims";

const LABEL_HEIGHT = 16;

type Props = {
    nodeId: string;
}

type DragContext = {
    sx: number;
    sy: number;
    nodeX: number;
    nodeY: number;
    moved: boolean;
}

function GraphNode<Params, Ctx>({ nodeId }: Props) {
    const node = useSelector(selectGraphNode(nodeId));
    const { graphDef, params } = useEditorContext<Params, Ctx>();
    const textRef = useRef<SVGTextElement>(null);
    const contentRef = useRef<SVGRectElement>(null);
    const [dragPos, setDragPos] = useState<[number, number]>();

    const dispatch = useDispatch();
    const nodeDef = graphDef.nodes[node.type];
    if (!nodeDef) {
        throwUnrecognizedNodeType(node.type);
    }

    useDrag<DragContext>(contentRef, {
        onStart(e) {
            return {
                sx: e.clientX,
                sy: e.clientY,
                nodeX: node.x,
                nodeY: node.y,
                moved: false
            };
        },
        onDrag(e, ctx) {
            ctx.moved = true;
            const x = ctx.nodeX + e.clientX - ctx.sx;
            const y = ctx.nodeY + e.clientY - ctx.sy;
            setDragPos([x, y]);
        },
        onEnd(e, ctx) {
            if (ctx.moved) {
                const x = ctx.nodeX + e.clientX - ctx.sx;
                const y = ctx.nodeY + e.clientY - ctx.sy;
                setDragPos(undefined);
                dispatch(setNodePos(nodeId, x, y));
            } else {
                dispatch(showConfigModal(nodeId));
            }
        }
    })

    const dims = resolveNodeDims(graphDef, nodeDef);
    const contentX = dims.padH;
    const contentY = dims.padV;
    const contentHeight = dims.height;
    const contentWidth = dims.width;

    const nodeWidth = dims.width + dims.padH * 2;
    const nodeHeight = dims.height + dims.padV * 2;

    let nodeHeightFull = nodeHeight;
    if (node.title) {
        nodeHeightFull += LABEL_HEIGHT;
    }

    let x = node.x;
    let y = node.y;

    if (dragPos) {
        x = dragPos[0];
        y = dragPos[1];
    }

    // mount / unmount the node
    const prevRef = useRef({ x, y });
    useEffect(() => {
        const prev = prevRef.current;
        dispatch(mountNode(nodeId, prev.x, prev.y));
        return () => {
            dispatch(unmountNode(nodeId));
        }
    }, [dispatch, nodeId]);

    // update position in the store
    useEffect(() => {
        const prev = prevRef.current;
        if (prev.x !== x || prev.y !== y) {
            prevRef.current = { x, y };
            dispatch(setNodeDragPos(nodeId, x, y));
        }
    }, [dispatch, nodeId, x, y]);

    return (
        <g className="ngraph-node" transform={`translate(${x},${y})`}>
            <rect ref={contentRef}
                className="ngraph-node-bg"
                width={nodeWidth}
                height={nodeHeight}
                rx={5}
                ry={5}
            />
            <g className="ngraph-node-content">
                {nodeDef.renderContent({
                    config: node.config,
                    params,
                    bounds: {
                        x: contentX,
                        y: contentY,
                        width: contentWidth,
                        height: contentHeight
                    }
                })}
            </g>
            {node.title && (
                <text
                    ref={textRef}
                    className="ngraph-node-label"
                    textAnchor="middle"
                    dominantBaseline="central"
                    x={nodeWidth / 2}
                    y={2 + nodeHeight + LABEL_HEIGHT / 2}
                >
                    {node.title}
                </text>
            )}
            {nodeHeight && (
                <GraphNodePorts
                    nodeId={nodeId}
                    nodeDef={nodeDef}
                    nodeWidth={nodeWidth}
                    nodeHeight={nodeHeightFull}
                />
            )}
        </g>
    );
}

export default React.memo(GraphNode) as typeof GraphNode;
