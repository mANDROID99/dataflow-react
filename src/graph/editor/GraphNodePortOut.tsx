import React from 'react';
import { TargetPort } from 'graph/types/graphTypes';
import { Point } from './dimensions';
import { GraphNodePortOutConfig } from 'graph/types/graphConfigTypes';
import Port from './Port';

type Props = {
    index: number;
    nodeId: string;
    portId: string;
    targets: TargetPort[] | undefined;
    dims: Point;
    portConfig: GraphNodePortOutConfig;
}

function GraphNodePortOut(props: Props) {
    const portConfig = props.portConfig;

    const x = props.dims.x;
    const y = props.dims.y;

    return (
        <Port
            label={portConfig.label}
            portOut
            x={x}
            y={y}
        />
    );
}

export default React.memo(GraphNodePortOut);
