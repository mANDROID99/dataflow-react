import React, { useReducer } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FormConfig, FormProps } from "../../types/formConfigTypes";

import Button from '../../common/Button';
import DataListItem from './DataListItem';
import { reducer, ActionType } from './dataListFormReducer';

export const DATA_LIST_FORM_ID = 'data-list';

function DataListForm(props: FormProps<string[]>) {
    const [values, dispatch] = useReducer(reducer, props.value);

    const handleSubmit = () => {
        props.onSubmit(values);
    };

    const handleAddNew = () => {
        dispatch({
            type: ActionType.ADD_ITEM,
            value: ''
        });
    };

    return (
        <div className="ngraph-modal md">
            <div className="ngraph-modal-header">Edit Items</div>
            <div className="ngraph-modal-body">
                <div className="ngraph-datalist">
                    {values.map((item, i) => (
                        <DataListItem
                            key={i}
                            value={item}
                            index={i}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
                <div className="ngraph-datalist-actions">
                    <Button onClick={handleAddNew}>
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

export const DATA_LIST_FORM: FormConfig<string[]> = {
    component: DataListForm
};
