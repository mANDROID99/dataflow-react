import React from "react";
import { FormConfig, FormProps } from "../../types/formConfigTypes";
import { GraphActionType } from "../../types/graphReducerTypes";
import Modal from "../../common/Modal";
import { useGraphContext } from "../graphEditorContext";

type Props<T> = {
    show: boolean;
    formId: string;
    value: T;
    params: unknown;
    formConfig: FormConfig<T>;
}

function GraphForm<T>(props: Props<T>) {
    const { show, value, formId, formConfig, params } = props;
    const { dispatch, graphConfig } = useGraphContext();
    
    const handleExit = () => {
        dispatch({ type: GraphActionType.CLEAR_FORM, formId });
    };

    const handleHide = () => {
        dispatch({ type: GraphActionType.HIDE_FORM, formId });
    };

    const handleSubmit = (value: unknown) => {
        dispatch({ type: GraphActionType.SUBMIT_FORM, formId, value });
    };

    const formProps: FormProps<T> = {
        value,
        params,
        onSubmit: handleSubmit,
        onHide: handleHide,
        graphConfig
    };

    return (
        <Modal show={show} onExit={handleExit} onHide={handleHide}>
             {React.createElement(formConfig.component, formProps)}
        </Modal>
    );
}

export default React.memo(GraphForm);
