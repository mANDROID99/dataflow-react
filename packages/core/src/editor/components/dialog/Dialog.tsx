import React, { useState } from 'react';
import { DialogOpts } from './DialogsManager';
import Modal from '../../../common/Modal';
import { DialogType } from './dialogTypes';
import TextDialog from './TextDialog';
import { invokeAll } from '../../../utils/functionUtils';

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
        if (dialog.type === DialogType.TEXT) {
            return (
                <TextDialog
                    show={show}
                    params={dialog.params as any}
                    onResult={invokeAll(dialog.onResult, handleHide)}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <Modal show={show} onHide={handleHide} onExit={onClear.bind(null, dialog.id)}>
            {renderContent()}
        </Modal>
    );

    return null;
}

