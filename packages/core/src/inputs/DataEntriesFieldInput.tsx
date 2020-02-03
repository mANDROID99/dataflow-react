import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FieldInputProps, Entry } from '../types/graphInputTypes';

import { DATA_ENTRIES_FORM_ID } from '../forms/dataentries/DataEntriesForm';
import Button from '../common/Button';
import { showForm } from '../store/actions';
import { nodeFieldReceiver } from '../types/storeTypes';

export default function DataEntriesFieldInput(props: FieldInputProps<Entry<string>[]>) {
    const { value, params } = props;
    const dispatch = useDispatch();

    const handleShowForm = () => {
        const receiver = nodeFieldReceiver(props.nodeId, props.fieldName);
        dispatch(showForm(DATA_ENTRIES_FORM_ID, value, params, receiver));
    };

    return (
        <Button onClick={handleShowForm}>
            <span>Edit</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}

