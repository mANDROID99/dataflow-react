import React, { useContext, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphNodeSpec } from '../types/graphSpecTypes';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { graphContext } from './Graph';
library.add(faTimes);

type Props = {
    nodeId: string;
    spec: GraphNodeSpec | undefined;
}

const TITLE_UNKNOWN = 'Unknown';

function GraphNodeHeader(props: Props): React.ReactElement {
    const nodeId = props.nodeId;
    
    const { actions } = useContext(graphContext);
    const removeNode = actions.removeNode;

    const handleRemove = useCallback(() => {
        removeNode(nodeId);
    }, [removeNode, nodeId]);

    return (
        <div className="graph-node-header">
            <div className="graph-node-header-title">
                { props.spec ? props.spec.title : TITLE_UNKNOWN }
            </div>
            <div className="graph-node-header-close-icon" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </div>
    );
}

export default React.memo(GraphNodeHeader);
