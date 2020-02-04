import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';

import { InputProps, DataGridInputValue } from '../types/graphInputTypes';
import { nodeFieldReceiver } from '../types/storeTypes';

import { DATA_GRID_FORM_ID } from '../forms/datatable/DataGridForm';
import Button from '../common/Button';
import { showForm } from '../store/actions';

export default function DataGridFieldInput(props: InputProps<DataGridInputValue>): React.ReactElement {
    const { nodeId, fieldName: fieldId, value, params } = props;
    const dispatch = useDispatch();

    const handleShowForm = () => {
        const receiver = nodeFieldReceiver(nodeId, fieldId);
        dispatch(showForm(DATA_GRID_FORM_ID, value, params, receiver));
    };

    return (
        <Button onClick={handleShowForm}>
            <span>Edit</span>
            <FontAwesomeIcon className="ngraph-btn-icon" icon="edit"/>
        </Button>
    );
}
