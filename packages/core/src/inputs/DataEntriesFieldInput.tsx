import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InputProps, Entry } from '../types/graphInputTypes';
import { DialogType } from '../types/dialogTypes';
import Button from '../common/Button';
import { useDialogsManager } from '../editor/components/dialog/DialogsManager';

export default function DataEntriesFieldInput({ value, onChanged }: InputProps<Entry<string>[]>) {
    const dialogManager = useDialogsManager();

    const handleShowForm = () => {
        dialogManager.showDialog(DialogType.DATA_ENTRIES, {
            header: 'Edit',
            value: value
        }).then(values => {
            if (values) onChanged(values);
        });
    };

    const label = `Edit ${value && value.length ? `(${value.length})` : ''}`;

    return (
        <Button onClick={handleShowForm}>
            <span>{label}</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}

