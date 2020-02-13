import React, { useState } from 'react';
import { DialogOpts } from './DialogsManager';
import Modal from '../../../common/Modal';
import { invokeAll } from '../../../utils/functionUtils';
import { getDialogDefinitionByType } from './dialogs';

type Props = {
    dialog: DialogOpts;
    onClear: (dialogId: string) => void;
}

export default function Dialog({ dialog, onClear }: Props) {
    const [show, setShow] = useState(true);

    const handleHide = () => {
        setShow(false);
    };

    const renderContent = () => {
        const d = getDialogDefinitionByType(dialog.type);
        if (!d) return null;

        
        return React.createElement(d.component, {
            show,
            params: dialog.params,
            onResult: invokeAll(dialog.onResult, handleHide)
        });
    };

    return (
        <Modal show={show} onHide={handleHide} onExit={onClear.bind(null, dialog.id)}>
            {renderContent()}
        </Modal>
    );
}
