import React, { useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reducer, ActionType } from './dataEntriesFormReducer';
import DataEntriesItem from './DataEntriesItem';
import { Entry } from '../../types/graphFieldInputTypes';
import { FormProps, FormConfig } from '../../types/formConfigTypes';
import Button from '../../common/Button';

function DataEntriesForm(props: FormProps<Entry<unknown>[]>) {
    const [values, dispatch] = useReducer(reducer, props.value);

    const handlePushNew = () => { 
        dispatch({ type: ActionType.PUSH_NEW });
    };

    const handleSubmit = () => {
        props.onSubmit(values);
    };

    return (
        <div className="ngraph-modal md">
            <div className="ngraph-modal-header">Params</div>
            <div className="ngraph-modal-body">
                <div className="ngraph-dataentries-headers">
                    <div className="ngraph-dataentries-header">Key</div>
                    <div className="ngraph-dataentries-header">Value</div>
                </div>
                <div className="ngraph-dataentries-list">
                    {values.map((value, index) => (
                        <DataEntriesItem
                            key={index}
                            index={index}
                            value={value}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
                <div className="ngraph-dataentries-actions">
                    <Button onClick={handlePushNew}>
                        <span>Add</span>
                        <FontAwesomeIcon className="ngraph-btn-icon" icon="plus"/>
                    </Button>
                </div>
            </div>
            <div className="ngraph-modal-footer">
                <Button variant="secondary" onClick={props.onHide}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    );
}

export const DATA_ENTRIES_FORM_ID = 'data-entries';

export const DATA_ENTRIES_FORM: FormConfig<Entry<unknown>[]> = {
    component: DataEntriesForm
};
