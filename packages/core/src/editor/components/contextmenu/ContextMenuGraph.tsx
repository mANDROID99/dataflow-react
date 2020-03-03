import React from 'react';
import { useDispatch } from 'react-redux';
import { hideContextMenu, clearGraph } from '../../../store/actions';
import ContextMenuItem from './ContextMenuItem';
import { useDialogsManager } from '../dialog/DialogsManager';
import { DialogType } from '../../../types/dialogTypes';

function ContextMenuGraph() {
    const dispatch = useDispatch();
    const dialogsManager = useDialogsManager();

    const handleClearGraph = () => {
        dispatch(hideContextMenu());
        dialogsManager.showDialog(DialogType.CONFIRM, {
            title: 'Confirm Clear',
            text: 'Are you sure you want to clear the graph? Press confirm to reset all changes.'
        }).then(result => {
            if (result) dispatch(clearGraph());
        });
    };

    return (
        <div className="ngraph-contextmenu-content">
            <div className="ngraph-contextmenu-header">Graph</div>
            <ContextMenuItem label="Clear" onSelected={handleClearGraph}/>
        </div>
    );
}

export default ContextMenuGraph;
