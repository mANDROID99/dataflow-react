import React, { useReducer, useMemo } from 'react';

import { FormConfig, FormProps } from "../../types/formConfigTypes";
import { GraphConfig } from '../../types/graphConfigTypes';
import { FieldInputProps } from '../../types/graphFieldInputTypes';

import Button from '../../common/Button';
import TextFieldInput from '../../inputs/TextFieldInput';
import DataListItem from './DataListItem';
import { reducer, ActionType } from './dataListFormReducer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DATA_LIST_FORM_ID = 'data-list';

export type FormParams = {
    inputType?: string;
    inputParams?: { [key: string]: unknown };
    inputInitialValue?: unknown;
}

function resolveInputComponent(graphConfig: GraphConfig<unknown, unknown>, inputType: string | undefined): React.ComponentType<FieldInputProps<any>> {
    if (inputType) {
        const inputConfig = graphConfig.inputs[inputType];

        if (inputConfig) {
            return inputConfig.component;
        }
    }

    return TextFieldInput;
}

function DataListForm(props: FormProps<unknown[]>) {
    const params = props.params as FormParams;
    const { inputType, inputInitialValue } = params;
    const [value, dispatch] = useReducer(reducer, props.value);

    const handleSubmit = () => {
        props.onSubmit(value);
    };

    const handleAddNew = () => {
        dispatch({
            type: ActionType.ADD_ITEM,
            value: inputInitialValue ?? ''
        });
    };

    const inputComponent = resolveInputComponent(props.graphConfig, inputType);
    const inputParams = useMemo(() => params.inputParams || {}, [params.inputParams]);

    return (
        <div className="ngraph-modal md">
            <div className="ngraph-modal-header">Edit Items</div>
            <div className="ngraph-modal-body">
                <div className="ngraph-datalist">
                    {value.map((item, i) => (
                        <DataListItem
                            key={i}
                            value={item}
                            index={i}
                            dispatch={dispatch}
                            inputComponent={inputComponent}
                            inputParams={inputParams}
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

export const DATA_LIST_FORM: FormConfig<unknown[]> = {
    component: DataListForm
};
