import React from 'react';
import { FormConfigs } from '../../types/formConfigTypes';
import GraphForm from './GraphForm';

type Props = {
    formConfigs: FormConfigs;
}

function GraphForms(props: Props) {
    const { formConfigs } = props;
    return (
        <>
            {Object.entries(formConfigs).map(([formId, formConfig]) => {
                if (formConfig) {
                    return (
                        <GraphForm
                            key={formId}
                            formId={formId}
                            formConfig={formConfig}
                        />
                    );
                }
            })}
        </>
    );
}

export default React.memo(GraphForms);
