import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DATA_ENTRIES_FORM_ID } from '../forms/dataentries/DataEntriesForm';
import Button from '../common/Button';
import { FieldInputProps, Entry } from '../types/graphFieldInputTypes';
import { useGraphContext } from '../editor/graphEditorContext';
import { GraphActionType } from '../types/graphReducerTypes';

export default function DataEntriesFieldInput(props: FieldInputProps<Entry<string>[]>) {
    const { value, onChanged, params } = props;
    const { dispatch } = useGraphContext();

    const showForm = () => {
        dispatch({
            type: GraphActionType.SHOW_FORM,
            formId: DATA_ENTRIES_FORM_ID,
            value,
            params,
            onResult: onChanged as any
        });
    };

    return (
        <Button onClick={showForm}>
            <span>Edit</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}

