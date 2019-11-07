import React from 'react';
import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { TargetPort } from '../types/graphTypes';
import { useDrag } from '../helpers/useDrag';

type Props = {
    targetPort: TargetPort[] | undefined;
    portSpec: GraphNodePortSpec;
    portOut: boolean;
}

function GraphNodePort(props: Props): React.ReactElement {
    const { portSpec, portOut } = props;
    const [drag, beginDrag] = useDrag();

    function renderLabel(): React.ReactElement {
        return <div className="graph-node-port-label">{ portSpec.name }</div>;
    }

    return (
        <div className="graph-node-port" onMouseDown={beginDrag}>
            {portOut ? renderLabel() : undefined}
            <div className="graph-node-port-connector"/>
            {portOut ? undefined : renderLabel()}
        </div>
    );
}

