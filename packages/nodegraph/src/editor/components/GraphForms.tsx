import React from 'react';
import { FormStates } from "../../types/graphReducerTypes";
import { FormConfigs } from '../../types/formConfigTypes';
import GraphForm from './GraphForm';

type Props = {
    forms: FormStates;
    formConfigs: FormConfigs;
}

function GraphForms(props: Props) {
    const { forms, formConfigs } = props;

    return (
        <>
            {Object.entries(forms).map(([formId, form]) => {
                if (form) {
                    const formConfig = formConfigs[formId];

                    if (formConfig) {
                        return (
                            <GraphForm
                                key={formId}
                                formId={formId}
                                show={form.show}
                                value={form.value}
                                params={form.params}
                                formConfig={formConfig}
                            />
                        );
                    }

                } else {
                    return null;
                }
            })}
        </>
    );
}

export default React.memo(GraphForms);
