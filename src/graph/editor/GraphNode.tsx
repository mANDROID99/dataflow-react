import React, { useContext, useMemo, useRef } from 'react';
import styles from './GraphEditor.module.scss';
import { GraphNode } from 'graph/types/graphTypes';
import { graphContext } from './GraphEditor';
import { translate, HEADER_ICON_OUTER_W, computeDimensions } from './dimensions';
import GraphNodeHeaderButton from './GraphNodeHeaderButton';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';
import GraphNodePortOut from './GraphNodePortOut';
import { useDrag } from '../../helper/useDrag';
import { GraphActionType, NodeDrag } from 'graph/types/graphStateTypes';
import GraphNodeField from './GraphNodeField';
library.add(faTimes);

type Props = {
    nodeId: string;
    graphNode: GraphNode;
    drag: NodeDrag | undefined;
}

function GraphNodeComponent(props: Props) {
    const nodeId = props.nodeId;
    const drag = props.drag;
    const graphNode = props.graphNode;
    const nodeType = graphNode.type;

    const { graphConfig, dispatch } = useContext(graphContext);
    const graphNodeConfig = graphConfig.nodes[nodeType];

    let x = graphNode.x;
    let y = graphNode.y;

    const dims = useMemo(() => computeDimensions(nodeType, graphConfig), [nodeType, graphConfig]);

    const portsConfigIn = graphNodeConfig.ports.in;
    const portsConfigOut = graphNodeConfig.ports.out;
    const fieldsConfig = graphNodeConfig.fields;

    const portsIn = graphNode.ports.in;
    const portsOut = graphNode.ports.out;
    const fields = graphNode.fields;

    const containerRef = useRef<SVGRectElement>(null);
    useDrag<{ sx: number, sy: number }>(containerRef as any, {
        onStart(mouseEvent) {
            dispatch({ type: GraphActionType.NODE_DRAG_BEGIN, nodeId });
            return {
                sx: mouseEvent.clientX,
                sy: mouseEvent.clientY
            };
        },
        onDrag(mouseEvent, prev) {
            const dx = mouseEvent.clientX - prev.sx;
            const dy = mouseEvent.clientY - prev.sy;
            dispatch({ type: GraphActionType.NODE_DRAG_UPDATE, dx, dy });
        },
        onEnd() {
            dispatch({ type: GraphActionType.NODE_DRAG_FINISH });
        }
    });

    if (drag) {
        x += drag.dragX;
        y += drag.dragY;
    }

    return (
        <g transform={translate(x, y)}>
            <rect
                className={styles.graphNodeContainer}
                width={dims.outer.width}
                height={dims.outer.height}
                ref={containerRef}
            />
            <text
                className={styles.graphNodeTitle}
                x={dims.header.x + dims.header.width / 2}
                y={dims.header.y + dims.header.height / 2}
            >
                { graphNodeConfig.title }
            </text>
            <GraphNodeHeaderButton icon={faMinus} x={dims.header.x} y={dims.header.y}/>
            <GraphNodeHeaderButton icon={faTimes} x={dims.header.x + dims.header.width - HEADER_ICON_OUTER_W} y={dims.header.y}/>
            {Object.keys(portsConfigOut).map((portId, index) => {
                const portDims = dims.portsOut.get(portId)!;

                return (
                    <GraphNodePortOut
                        key={portId}
                        index={index}
                        nodeId={nodeId}
                        portId={portId}
                        portConfig={portsConfigOut[portId]}
                        targets={portsOut[portId]}
                        dims={portDims}
                    />
                );
            })}
            {Object.keys(fieldsConfig).map((fieldId, index) => {
                const fieldValue = fields[fieldId];
                const fieldConfig = fieldsConfig[fieldId];
                const fieldDims = dims.fields.get(fieldId)!;

                return (
                    <GraphNodeField
                        key={fieldId}
                        index={index}
                        nodeId={nodeId}
                        fieldId={fieldId}
                        fieldValue={fieldValue}
                        fieldConfig={fieldConfig}
                        dims={fieldDims}
                    />
                );
            })}
        </g>
    );
}

export default React.memo(GraphNodeComponent);
