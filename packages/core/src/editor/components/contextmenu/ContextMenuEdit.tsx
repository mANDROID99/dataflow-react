import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import { deleteNode, cloneNode, setNodeName, hideContextMenu } from '../../../store/actions';
import ContextMenuItem from './ContextMenuItem';
import { useDialogsManager } from '../dialog/DialogsManager';
import { DialogType } from '../../../types/dialogTypes';
import { selectGraphNodeName } from '../../../store/selectors';

type Props = {
    nodeId: string;
}

function ContextMenuEdit(props: Props) {
    const { nodeId } = props;
    const dispatch = useDispatch();
    const store = useStore();
    const dialogsManager = useDialogsManager();

    const handleDeleteNode = () => {
        dispatch(deleteNode(nodeId));
    };

    const handleCloneNode = () => {
        dispatch(cloneNode(nodeId));
    };

    const handleRenameNode = () => {
        dispatch(hideContextMenu());
        const nodeName = selectGraphNodeName(store.getState(), nodeId);
        dialogsManager.showDialog(DialogType.TEXT, { header: 'Name', text: nodeName ?? '' }).then(name => {
            if (name) dispatch(setNodeName(nodeId, name));
        });
    };

    return (
        <div className="ngraph-contextmenu-content">
            <div className="ngraph-contextmenu-header">Edit</div>
            <ContextMenuItem label="Rename" onSelected={handleRenameNode}/>
            <ContextMenuItem label="Clone" onSelected={handleCloneNode}/>
            <ContextMenuItem label="Delete" onSelected={handleDeleteNode}/>
        </div>
    );
}

export default ContextMenuEdit;
