import React, { useContext } from 'react';

import { GraphNodePortSpec } from '../types/graphSpecTypes';
import { GraphActionType } from '../types/graphStateTypes';

import { Context } from '../graphContext';

type Props = {
    nodeId: string;
    portSpec: GraphNodePortSpec;
    portName: string;
    portIn: boolean;
}

function GraphNodePort({ nodeId, portSpec, portName, portIn }: Props) {
    const { dispatch } = useContext(Context);

    function renderPortComponent() {
        return (
            <div className="graph-node-port" onMouseDown={() => {
                dispatch({ type: GraphActionType.BEGIN_PORT_DRAG, nodeId, portIn, portName })
            }}/>
        );
    }
    
    return (
        <div className="graph-node-port-group">
            { portIn ? renderPortComponent() : undefined }
            <div className="graph-node-port-label">{portSpec.label}</div>
            { portIn ? undefined : renderPortComponent() }
        </div>
    );
}

export default React.memo(GraphNodePort);
