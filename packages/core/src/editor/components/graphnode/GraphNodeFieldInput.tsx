import React, { useCallback, useMemo } from 'react';
import { GraphFieldInputConfig, GraphNodeFieldConfig } from '../../../types/graphConfigTypes';
import { InputProps } from '../../../types/graphInputTypes';
import { GraphNodeActions } from '../../../types/graphNodeComponentTypes';
import { resolve } from '../../../utils/resolveUtils';
import { useGraphContext } from '../../graphEditorContext';

export type FieldInputProps<C, P> = {
    context: C;
    fieldName: string;
    fieldValue: unknown;
    fieldConfig: GraphNodeFieldConfig<C, P>;
    fieldValues: { [key: string]: unknown };
    actions: GraphNodeActions;
    onChanged: (fieldName: string, value: unknown) => void;
}

function GraphNodeFieldInput<C, P>({ context, fieldName, fieldConfig, fieldValues, fieldValue, actions, onChanged }: FieldInputProps<C, P>) {
    const { graphConfig, params } = useGraphContext<C, P>();
    const inputConfig: GraphFieldInputConfig = graphConfig.inputs[fieldConfig.type];
    
    // resolve field params
    const fieldParams = useMemo(() => {
        return fieldConfig.params ? resolve(fieldConfig.params, { context, params, fields: fieldValues }) : {};
    }, [fieldConfig, context, params, fieldValues]);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        onChanged(fieldName, value);
    }, [onChanged, fieldName]);

    // create the input element
    const inputComponent = inputConfig.component;

    // properties to pass to the input component
    const inputProps: InputProps<unknown> = {
        value: fieldValue,
        params: fieldParams,
        fieldConfig,
        actions,
        context,
        onChanged: handleChanged
    };

    return React.createElement(inputComponent, inputProps);
}

export default React.memo(GraphNodeFieldInput, (prev, next) => {
    if (prev.fieldValues !== next.fieldValues && next.fieldConfig.renderWhenAnyFieldChanged) {
        return false;
    }

    return prev.fieldName === next.fieldName
        && prev.fieldValue === next.fieldValue;
}) as typeof GraphNodeFieldInput;
