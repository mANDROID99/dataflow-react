import React, { useContext, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { graphContext } from './GraphEditor';
import { removeNode } from '../editorActions';

type Props = {
    nodeId: string;
    title: string | undefined
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
                { props.title ?? TITLE_UNKNOWN }
            </div>
            <div className="graph-node-header-close-icon" onClick={handleRemove}>
                <FontAwesomeIcon icon="times"/>
            </div>
        </>
    );
}

export default React.memo(GraphNodeHeader);
