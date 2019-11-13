import React from 'react';
import classNames from 'classnames';

import { GraphNodePortSpec } from '../types/graphSpecTypes';
import GraphNodePort from './GraphNodePort';
import { TargetPort } from '../types/graphTypes';

type Props = {
    nodeId: string;
    nodeType: string;
    portSpecs: GraphNodePortSpec[];
    portsOut: boolean;
    portTargets: {
        [portId: string]: TargetPort[] | undefined;
    };
}

function GraphNodePorts(props: Props): React.ReactElement {
    const { nodeId, nodeType, portsOut, portSpecs, portTargets } = props;
    return (
        <div className={classNames("graph-node-ports", { out: portsOut })}>
            { portSpecs.map((portSpec: GraphNodePortSpec) => {
                const targets = portTargets[portSpec.name];
                return (
                    <GraphNodePort
                        key={portSpec.name}
                        portTargets={targets}
                        nodeId={nodeId}
                        nodeType={nodeType}
                        portSpec={portSpec}
                        portOut={portsOut}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodePorts);
