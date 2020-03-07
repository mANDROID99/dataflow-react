import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig, GraphFieldInputConfig } from '../../../types/graphConfigTypes';
import { InputProps } from '../../../types/graphInputTypes';
import { GraphNodeActions } from '../../../types/graphNodeComponentTypes';
import { useGraphContext } from '../../graphEditorContext';
import { setFieldValue } from '../../../store/actions';
import { resolve } from '../../../utils/resolveUtils';

type Props<C, P> = {
    nodeId: string;
    context: C;
    fieldName: string;
    fieldValue: unknown;
    fieldConfig: GraphNodeFieldConfig<C, P>;
    fields: { [key: string]: unknown };
    actions: GraphNodeActions;
}

function GraphNodeField<C, P>({ nodeId, context, fieldName, fieldConfig, fields, fieldValue, actions }: Props<C, P>) {
    const inputType = fieldConfig.type;
    const dispatch = useDispatch();
    const { graphConfig, params } = useGraphContext<C, P>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve field params
    const fieldParams = useMemo(() => {
        return fieldConfig.params ? resolve(fieldConfig.params, { context, params }) : {};
    }, [fieldConfig, context, params]);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(nodeId, fieldName, value));
    }, [nodeId, fieldName, dispatch]);

    // create the input element
    const inputComponent = input?.component;
    function renderInputElement() {
        if (!inputComponent) {
            return 'Unknown Input Type';
        }

        // properties to pass to the input component
        const inputProps: InputProps<unknown> = {
            value: fieldValue,
            params: fieldParams,
            fieldConfig,
            actions,
            context,
            fields,
            onChanged: handleChanged
        };

        return React.createElement(inputComponent, inputProps);
    }

    // field is hidden
    if (fieldParams.hidden) {
        return null;
    }

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                {renderInputElement()}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField, (prev, next) => {
    if (prev.fields !== next.fields && next.fieldConfig.renderWhenAnyFieldChanged) {
        return false;
    }

    return prev.actions === next.actions
        && prev.context === next.context
        && prev.fieldConfig === next.fieldConfig
        && prev.fieldName === next.fieldName
        && prev.fieldValue === next.fieldValue
        && prev.nodeId === next.nodeId;
}) as typeof GraphNodeField;
