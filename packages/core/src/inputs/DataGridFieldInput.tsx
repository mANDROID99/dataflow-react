import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DATA_GRID_FORM_ID } from '../forms/datatable/DataGridForm';
import { FieldInputProps, DataGridInputValue } from '../types/graphFieldInputTypes';
import Button from '../common/Button';
import { useGraphContext } from '../editor/graphEditorContext';
import { GraphActionType } from '../types/graphReducerTypes';

export default function DataGridFieldInput(props: FieldInputProps<DataGridInputValue>): React.ReactElement {
    const { value, onChanged } = props;
    const { dispatch } = useGraphContext();

    const showForm = () => {
        dispatch({
            type: GraphActionType.SHOW_FORM,
            formId: DATA_GRID_FORM_ID,
            params: props.params,
            value,
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
