import React, { useState, useEffect } from 'react';

import { PortId } from "../../GraphNodePortRefs";
import { plot } from './curveHelpers';
import { useContainerContext } from '../../graphContainerContext';

type ConnectionProps = {
    startPort: PortId;
    endPort: PortId;
}

function GraphConnection(props: ConnectionProps) {
    const { startPort, endPort } = props;
    const { ports } = useContainerContext();

    const [startPos, setStartPos] = useState(() => ports.getPortState(startPort));
    const [endPos, setEndPos] = useState(() => ports.getPortState(endPort));

    useEffect(() => {
        return ports.subscribe(startPort, (startPortState) => {
            setStartPos(startPortState);
        });
    }, [ports, startPort]);

    useEffect(() => {
        return ports.subscribe(endPort, (endPortState) => {
            setEndPos(endPortState);
        });
    }, [ports, endPort]);

    if (!startPos || !endPos) {
        return null;
    }

    const d = plot(startPos.x, startPos.y, endPos.x, endPos.y, true);
    return (
        <path className="ngraph-graph-connection" d={d}/>
    );
}

export default React.memo(GraphConnection);
