import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FieldInputProps } from '../types/graphFieldInputTypes';
import { GraphActionType } from '../types/graphReducerTypes';

import Button from '../common/Button';
import { useGraphContext } from '../editor/graphEditorContext';
import { DATA_LIST_FORM_ID } from '../forms/datalist/DataListForm';

export default function DataListFieldInput(props: FieldInputProps<unknown[]>): React.ReactElement {
    const { value, onChanged, params } = props;
    const { dispatch } = useGraphContext();

    const showForm = () => {
        dispatch({
            type: GraphActionType.SHOW_FORM,
            formId: DATA_LIST_FORM_ID,
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
