import React, { useContext } from 'react';
import { GraphNodePortSpec, GraphNodePort as GraphNodePortT } from '../graphTypes';
import { Context } from '../graphContext';

type Props = {
    nodeId: string;
    portSpec: GraphNodePortSpec;
    port: GraphNodePortT | undefined;
    portOut: boolean;
}

function GraphNodePort({ nodeId, portSpec, port, portOut }: Props) {
    const { actions } = useContext(Context);

    function renderPortComponent() {
        return (
            <div className="graph-node-port" onMouseDown={(evt: React.MouseEvent) => {
                evt.preventDefault();
                evt.stopPropagation();
                actions.onNodePortStartDrag(nodeId, portOut, portSpec.name);
            }}/>
        );
    }
    
    return (
        <div className="graph-node-port-group">
            { portOut ? undefined : renderPortComponent() }
            <div className="graph-node-port-label">{portSpec.label}</div>
            { portOut ? renderPortComponent() : undefined }
        </div>
    );
}

export default React.memo(GraphNodePort);
