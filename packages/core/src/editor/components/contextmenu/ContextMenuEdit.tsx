import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteNode, cloneNode } from '../../../store/actions';

type Props = {
    nodeId: string;
}

function ContextMenuEdit(props: Props) {
    const { nodeId } = props;
    const dispatch = useDispatch();

    const handleDeleteNode = () => {
        dispatch(deleteNode(nodeId));
    };

    const handleCloneNode = () => {
        dispatch(cloneNode(nodeId));
    };

    return (
        <div className="ngraph-contextmenu-content">
            <div className="ngraph-contextmenu-header">Edit</div>
            <div className="ngraph-contextmenu-item" onClick={handleDeleteNode}>
                <div className="ngraph-contextmenu-item-label" style={{ textAlign: 'center' }}>Delete</div>
            </div>
            <div className="ngraph-contextmenu-item" onClick={handleCloneNode}>
                <div className="ngraph-contextmenu-item-label" style={{ textAlign: 'center' }}>Clone</div>
            </div>
        </div>
    );
}

export default ContextMenuEdit;
