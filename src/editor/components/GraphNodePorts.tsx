import React from 'react';
import classNames from 'classnames';
import GraphNodePort from './GraphNodePort';

type Props = {
    nodeId: string;
    portNames: string[];
    portsOut: boolean;
}

function GraphNodePorts(props: Props): React.ReactElement {
    const { nodeId, portsOut, portNames } = props;
    return (
        <div className={classNames("graph-node-ports", { out: portsOut })}>
            { portNames.map((portName: string) => {
                return (
                    <GraphNodePort
                        key={portName}
                        nodeId={nodeId}
                        portId={portName}
                        portOut={portsOut}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodePorts);
