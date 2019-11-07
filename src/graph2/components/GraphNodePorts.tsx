import React from 'react';
import classNames from 'classnames';

type Props = {
    portsOut: boolean;
}

function GraphNodePorts(props: Props): React.ReactElement {
    return (
        <div className={classNames("graph-node-ports", { out: props.portsOut })}>
            
        </div>
    )
}

export default React.memo(GraphNodePorts);
