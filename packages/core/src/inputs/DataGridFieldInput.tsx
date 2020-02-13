import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputProps, DataGridInputValue } from '../types/graphInputTypes';

import Button from '../common/Button';
import { useDialogsManager } from '../editor/components/dialog/DialogsManager';
import { DialogType } from '../types/dialogTypes';

export default function DataGridFieldInput({ value, onChanged }: InputProps<DataGridInputValue>): React.ReactElement {
    const dialogManager = useDialogsManager();

    const handleShowForm = () => {
        dialogManager.showDialog(DialogType.DATA_GRID, {
            header: 'Edit',
            value
        }).then(result => {
            if (result) onChanged(result);
        });
    };

    const label = `Edit ${value && value.rows.length ? `(${value.rows.length})` : ''}`;

    return (
        <Button onClick={handleShowForm}>
            <span>{label}</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}
