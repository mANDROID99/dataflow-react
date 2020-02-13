import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InputProps } from '../types/graphInputTypes';
import { DialogType } from '../types/dialogTypes';
import Button from '../common/Button';
import { useDialogsManager } from '../editor/components/dialog/DialogsManager';

export default function DataListFieldInput({ value, onChanged }: InputProps<string[]>): React.ReactElement {
    const dialogManager = useDialogsManager();

    const handleShowForm = () => {
        dialogManager.showDialog(DialogType.DATA_LIST, {
            header: 'Edit',
            value
        }).then(result => {
            if (result) onChanged(result);
        });
    };

    const label = `Edit ${value ? `(${value.length})` : ''}`;

    return (
        <Button onClick={handleShowForm}>
            <span>{label}</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}
