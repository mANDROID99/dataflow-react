import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { GraphNodeSpec } from '../types/graphSpecTypes';

import { graphContext } from './Graph';
import { removeNode } from '../graphActions';

type Props = {
    nodeId: string;
    spec: GraphNodeSpec | undefined;
}

const TITLE_UNKNOWN = 'Unknown';

function GraphNodeHeader(props: Props): React.ReactElement {
    const nodeId = props.nodeId;
    
    const { graphId } = useContext(graphContext);
    const dispatch = useDispatch();

    const handleRemove = useCallback(() => {
        dispatch(removeNode(graphId, nodeId));
    }, [dispatch, graphId, nodeId]);

    return (
        <>
            <div className="graph-node-header-title">
                { props.spec ? props.spec.title : TITLE_UNKNOWN }
            </div>
            <div className="graph-node-header-close-icon p-2" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </>
    );
}

export default React.memo(GraphNodeHeader);
