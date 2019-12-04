import React, { useContext, useMemo } from 'react';
import styles from './GraphEditor.module.scss';
import { GraphNode } from 'graph/types/graphTypes';
import { graphContext } from './GraphEditor';
import { HEADER_HEIGHT, translate, HEADER_ICON_OUTER_W, computeDimensions } from './dimensions';
import GraphNodeHeaderButton from './GraphNodeHeaderButton';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';
import GraphNodePortOut from './GraphNodePortOut';
library.add(faTimes);

type Props = {
    nodeId: string;
    graphNode: GraphNode;
}

function GraphNodeComponent(props: Props) {
    const nodeId = props.nodeId;
    const graphNode = props.graphNode;
    const nodeType = graphNode.type;

    const { graphConfig } = useContext(graphContext);
    const graphNodeConfig = graphConfig.nodes[nodeType];

    const x = graphNode.x;
    const y = graphNode.y;
    const dims = useMemo(() => computeDimensions(nodeType, graphConfig), [nodeType, graphConfig]);

    const portsConfigIn = graphNodeConfig.ports.in;
    const portsConfigOut = graphNodeConfig.ports.out;

    const portsIn = graphNode.ports.in;
    const portsOut = graphNode.ports.out;

    return (
        <>
            <rect
                className={styles.graphNodeContainer}
                width={dims.fullWidth}
                height={dims.fullHeight} 
            />
            <text
                className={styles.graphNodeTitle}
                x={dims.fullWidth / 2}
                y={HEADER_HEIGHT / 2}
            >
                { graphNodeConfig.title }
            </text>
            <GraphNodeHeaderButton icon={faMinus} x={0} y={0}/>
            <GraphNodeHeaderButton icon={faTimes} x={dims.fullWidth - HEADER_ICON_OUTER_W} y={0}/>
            {Object.keys(portsConfigOut).map((portId, index) => {
                return (
                    <GraphNodePortOut
                        key={portId}
                        nodeId={nodeId}
                        portId={portId}
                        portConfig={portsConfigOut[portId]}
                        targets={portsOut[portId]}
                        index={index}
                        dims={dims}
                    />
                );
            })}
        </>
    );
}

const GraphNodeComponentMemo = React.memo(GraphNodeComponent);

function GraphNodeGroup(props: Props) {
    const x = props.graphNode.x;
    const y = props.graphNode.y;

    return (
        <g transform={translate(x, y)}>
            <GraphNodeComponentMemo {...props}/>
        </g>
    )
}

export default React.memo(GraphNodeGroup);
