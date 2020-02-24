import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig, GraphFieldInputConfig, FieldResolverParams } from '../../../types/graphConfigTypes';
import { InputProps } from '../../../types/graphInputTypes';
import { GraphNodeActions } from '../../../types/graphNodeComponentTypes';
import { useGraphContext } from '../../graphEditorContext';
import { useFieldParams } from '../../../utils/useFieldParams';
import { setFieldValue } from '../../../store/actions';

type Props<Ctx, Params> = {
    nodeId: string;
    context: Ctx;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx, Params>;
    actions: GraphNodeActions;
    fields: { [key: string]: unknown };
}

function GraphNodeField<Ctx, Params>({ nodeId, context, fieldName, fieldConfig, fields, actions }: Props<Ctx, Params>) {
    const inputType = fieldConfig.type;
    const fieldValue = fields[fieldName];
    
    const dispatch = useDispatch();
    const { graphConfig, params } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve next field params
    const resolverParams = useMemo<FieldResolverParams<Ctx, Params>>(() => ({ context, params, fields }), [context, params, fields]);
    const fieldParams = useFieldParams(fieldConfig, resolverParams);

    // handle the input value changed
    const handleChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(nodeId, fieldName, value));
    }, [nodeId, fieldName, dispatch]);

    // create the React input element
    const inputComponent = input?.component;
    const renderInput = () => {
        if (!inputComponent) {
            return 'Unknown Input Type';
        }

        // properties to pass to the input component
        const inputProps: InputProps<unknown> = {
            value: fieldValue,
            fieldName,
            nodeId,
            params: fieldParams,
            actions,
            onChanged: handleChanged
        };

        return React.createElement(inputComponent, inputProps);
    };

    if (fieldParams.hidden) {
        return null;
    }

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                {renderInput()}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField) as typeof GraphNodeField;
