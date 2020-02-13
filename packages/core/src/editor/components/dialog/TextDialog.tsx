import React from 'react';
import { TextDialogParams } from "./dialogTypes";
import Button from '../../../common/Button';
import CommonTextInput from '../../../common/CommonTextInput';
import { useState } from 'react';

type Props = {
    show: boolean;
    params: TextDialogParams;
    onResult: (value: string | undefined) => void;
}

export default function TextDialog({ show, params, onResult }: Props) {
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
