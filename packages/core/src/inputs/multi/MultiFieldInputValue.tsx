import React, { useMemo, useCallback } from 'react';

import { GraphNodeSubFieldConfig, GraphFieldInputConfig } from '../../types/graphConfigTypes';
import { InputProps } from '../../types/graphInputTypes';
import { useGraphContext } from '../../editor/graphEditorContext';
import { resolve } from '../../utils/resolveUtils';
import { GraphNodeActions } from '../../types/graphNodeComponentTypes';

type Props<C, P> = {
    name: string;
    value: unknown;
    context: C;
    fieldConfig: GraphNodeSubFieldConfig<C, P>;
    onChanged: (name: string, value: unknown) => void;
    actions: GraphNodeActions;
}

function MultiFieldInputValue<C, P>({ name, value, context, fieldConfig, onChanged, actions }: Props<C, P>) {
    const inputType = fieldConfig.type;
    
    const { graphConfig, params } = useGraphContext<C, P>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve field params
    const fieldParams = useMemo(() => {
        return fieldConfig.params ? resolve(fieldConfig.params, { context, params }) : {};
    }, [fieldConfig, context, params]);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        onChanged(name, value);
    }, [name, onChanged]);

    // create the input element
    const inputComponent = input?.component;
    const inputElement = useMemo(() => {
        if (!inputComponent) {
            return 'Unknown Input Type';
        }

        // properties to pass to the input component
        const inputProps: InputProps<unknown> = {
            value,
            params: fieldParams,
            fieldConfig,
            actions,
            context,
            onChanged: handleChanged
        };

        return React.createElement(inputComponent, inputProps);
    }, [
        value,
        fieldParams,
        fieldConfig,
        handleChanged,
        inputComponent,
        context,
        actions
    ]);

    return (
        <div className="ngraph-multifield-input" style={fieldConfig.style}>
            {inputElement}
        </div>
    );
}

export default React.memo(MultiFieldInputValue);
