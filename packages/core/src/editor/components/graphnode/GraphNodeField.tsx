import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig, GraphFieldInputConfig } from '../../../types/graphConfigTypes';
import { InputProps } from '../../../types/graphInputTypes';
import { GraphNodeActions } from '../../../types/graphNodeComponentTypes';
import { useGraphContext } from '../../graphEditorContext';
import { setFieldValue } from '../../../store/actions';
import { createMemoizedCallbackSelector } from '../../../utils/createMemoizedCallbackSelector';

type Props<C, P> = {
    nodeId: string;
    context: C;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<C, P>;
    actions: GraphNodeActions;
    fields: { [key: string]: unknown };
}

function GraphNodeField<C, P>({ nodeId, context, fieldName, fieldConfig, fields, actions }: Props<C, P>) {
    const inputType = fieldConfig.type;
    const fieldValue = fields[fieldName];
    
    const dispatch = useDispatch();
    const { graphConfig, params } = useGraphContext<C, P>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve next field params. Uses "createMemoizedCallbackSelector" to compare the previous and next values, to determine if params need to be recomputed
    const fieldParamsSelector = useMemo(() => fieldConfig.resolveParams && createMemoizedCallbackSelector(fieldConfig.resolveParams), [fieldConfig.resolveParams]);
    const paramsResolved = useMemo(() => fieldParamsSelector?.({ context, params, fields }), [fieldParamsSelector, context, params, fields]);

    // merge the resolved with the static field params
    const paramsMerged = useMemo(() => {
        if (paramsResolved && fieldConfig.params) {
            return Object.assign({}, paramsResolved, fieldConfig.params);

        } else if (paramsResolved) {
            return paramsResolved;

        } else {
            return fieldConfig.params;
        }
    }, [paramsResolved, fieldConfig.params]);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(nodeId, fieldName, value));
    }, [nodeId, fieldName, dispatch]);

    // create the React input element
    const inputComponent = input?.component;
    const inputElement = useMemo(() => {
        if (!inputComponent) {
            return 'Unknown Input Type';
        }

        // properties to pass to the input component
        const inputProps: InputProps<unknown> = {
            value: fieldValue,
            fieldName,
            nodeId,
            params: paramsMerged || {},
            actions,
            onChanged: handleChanged
        };

        return React.createElement(inputComponent, inputProps);
    }, [
        actions,
        fieldName,
        paramsMerged,
        fieldValue,
        handleChanged,
        inputComponent,
        nodeId
    ]);

    if (paramsResolved?.hidden) {
        return null;
    }

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                {inputElement}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField) as typeof GraphNodeField;
