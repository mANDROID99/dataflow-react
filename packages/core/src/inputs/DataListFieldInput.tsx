import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import { InputProps } from '../types/graphInputTypes';
import { nodeFieldReceiver } from '../types/storeTypes';

import { DATA_LIST_FORM_ID } from '../forms/datalist/DataListForm';
import { showForm } from '../store/actions';
import Button from '../common/Button';

export default function DataListFieldInput(props: InputProps<unknown[]>): React.ReactElement {
    const { nodeId, fieldName: fieldId, value, params } = props;
    const dispatch = useDispatch();

    const handleShowForm = () => {
        const receiver = nodeFieldReceiver(nodeId, fieldId);
        dispatch(showForm(DATA_LIST_FORM_ID, value, params, receiver));
    };

    const label = `Edit ${value ? `(${value.length})` : ''}`;

    return (
        <Button onClick={handleShowForm}>
            <span>{label}</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}
