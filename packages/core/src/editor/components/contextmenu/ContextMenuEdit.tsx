import React from 'react';
import { GraphActionType, GraphAction } from '../../../types/graphReducerTypes';

type Props = {
    nodeId: string;
    dispatch: React.Dispatch<GraphAction>;
}

function ContextMenuEdit(props: Props) {
    const nodeId = props.nodeId;
    const dispatch = props.dispatch;

    const handleDeleteNode = () => {
        dispatch({ type: GraphActionType.DELETE_NODE, nodeId });
    };

    const handleCopyNode = () => {
        dispatch({ type: GraphActionType.COPY_NODE, nodeId });
    };

    return (
        <div className="ngraph-contextmenu-content">
            <div className="ngraph-contextmenu-header">Edit</div>
            <div className="ngraph-contextmenu-item" onClick={handleDeleteNode}>
                <div className="ngraph-contextmenu-item-label" style={{ textAlign: 'center' }}>Delete</div>
            </div>
            <div className="ngraph-contextmenu-item" onClick={handleCopyNode}>
                <div className="ngraph-contextmenu-item-label" style={{ textAlign: 'center' }}>Copy</div>
            </div>
        </div>
    );
}

export default ContextMenuEdit;
