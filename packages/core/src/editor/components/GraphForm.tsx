import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { FormConfig, FormProps } from "../../types/formConfigTypes";

import Modal from "../../common/Modal";
import { createFormStateSelector } from "../../store/selectors";
import { clearForm, hideForm, submitForm } from "../../store/actions";
import { useGraphContext } from "../graphEditorContext";

type Props<T> = {
    formId: string;
    formConfig: FormConfig<T>;
}

function GraphForm<T>(props: Props<T>) {
    const { formId, formConfig } = props;
    const formState = useSelector(createFormStateSelector(formId));
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext();

    if (formState == null) {
        return null;
    }
    
    const handleExit = () => {
        dispatch(clearForm(formId));
    };

    const handleHide = () => {
        dispatch(hideForm(formId));
    };

    const handleSubmit = (value: unknown) => {
        dispatch(submitForm(formId, value));
    };

    const formProps: FormProps<T> = {
        value: formState.value as T,
        params: formState.params,
        onSubmit: handleSubmit,
        onHide: handleHide,
        graphConfig
    };

    return (
        <Modal show={formState.show} onExit={handleExit} onHide={handleHide}>
             {React.createElement(formConfig.component, formProps)}
        </Modal>
    );
}

export default React.memo(GraphForm);
