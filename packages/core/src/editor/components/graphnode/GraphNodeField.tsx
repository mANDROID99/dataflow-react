import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig, GraphFieldInputConfig, FieldResolverParams } from '../../../types/graphConfigTypes';
import { InputProps, GraphNodeCallbacks } from '../../../types/graphInputTypes';
import { useGraphContext } from '../../graphEditorContext';
import { useFieldParams } from '../../../utils/useFieldParams';
import { setFieldValue } from '../../../store/actions';

type Props<Ctx, Params> = {
    nodeId: string;
    context: Ctx;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx, Params>;
    fieldValue: unknown;
    callbacks: GraphNodeCallbacks;
}

function GraphNodeField<Ctx, Params>({ nodeId, context, fieldName, fieldConfig, fieldValue, callbacks }: Props<Ctx, Params>) {
    const inputType = fieldConfig.type;
    
    const dispatch = useDispatch();
    const { graphConfig, params } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve next field params
    const resolverParams = useMemo<FieldResolverParams<Ctx, Params>>(() => ({ context, params }), [context, params]);
    const fieldParams = useFieldParams(fieldConfig, resolverParams);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(nodeId, fieldName, value));
    }, [nodeId, fieldName, dispatch]);

    // properties to pass to the input component
    const inputComponent = input?.component;
    const inputProps: InputProps<unknown> = {
        value: fieldValue,
        fieldName,
        nodeId,
        params: fieldParams,
        callbacks,
        onChanged: handleChanged
    };

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                {inputComponent ? React.createElement(inputComponent, inputProps) : 'Unknown Input Type'}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField) as typeof GraphNodeField;
