import React from 'react';

import { DialogComponentProps, ConfirmDialogParams } from '../../../../types/dialogTypes';
import Button from '../../../../common/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ConfirmDialog({ params, onResult }: DialogComponentProps<ConfirmDialogParams, boolean>) {

    const handleCancel = () => {
        onResult(false);
    };

    const handleConfirm = () => {
        onResult(true);
    };

    return (
        <div className="ngraph-modal">
            <div className="ngraph-modal-header">
                <div className="ngraph-dialog-confirm-header">
                    <FontAwesomeIcon icon="exclamation-triangle"/>
                    <div className="ngraph-dialog-confirm-header-text">
                        {params.title}
                    </div>
                </div>
            </div>
            <div className="ngraph-modal-body ngraph-dialog-confirm-body">
                {params.text}
            </div>
            <div className="ngraph-modal-footer">
                <Button onClick={handleCancel} variant="secondary">Cancel</Button>
                <Button onClick={handleConfirm}>Confirm</Button>
            </div>
        </div>
    );
}
