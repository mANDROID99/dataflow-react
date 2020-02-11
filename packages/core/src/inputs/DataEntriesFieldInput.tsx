import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { InputProps, Entry } from '../types/graphInputTypes';

import { DATA_ENTRIES_FORM_ID } from '../forms/dataentries/DataEntriesForm';
import Button from '../common/Button';
import { showForm } from '../store/actions';
import { nodeFieldReceiver } from '../types/storeTypes';

export default function DataEntriesFieldInput(props: InputProps<Entry<string>[]>) {
    const { value, params } = props;
    const dispatch = useDispatch();

    const handleShowForm = () => {
        const receiver = nodeFieldReceiver(props.nodeId, props.fieldName);
        dispatch(showForm(DATA_ENTRIES_FORM_ID, value, params, receiver));
    };

    const label = `Edit ${value && value.length ? `(${value.length})` : ''}`;

    return (
        <Button onClick={handleShowForm}>
            <span>{label}</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}

