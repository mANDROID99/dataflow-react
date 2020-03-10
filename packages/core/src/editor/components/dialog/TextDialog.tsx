import React, { useState } from 'react';
import Button from '../../../common/Button';
import CommonTextInput from '../../../common/CommonTextInput';
import { DialogComponentProps, TextDialogParams } from "../../../types/dialogTypes";

export default function TextDialog({ show, params, onResult }: DialogComponentProps<TextDialogParams, string | undefined>) {
    const [text, setText] = useState(params.text);

    const handleSave = () => {
        onResult(text);
    };

    const handleCancel = () => {
        onResult(undefined);
    };

    return (
        <div className="ngraph-modal">
            <div className="ngraph-modal-header">{params.header}</div>
            <div className="ngraph-modal-body ngraph-p-2">
                <CommonTextInput value={text} onChange={setText} focus/>
            </div>
            <div className="ngraph-modal-footer">
                <Button disabled={!show} onClick={handleCancel} variant="secondary">Cancel</Button>
                <Button disabled={!show} onClick={handleSave}>Save</Button>
            </div>
        </div>
    );
}
