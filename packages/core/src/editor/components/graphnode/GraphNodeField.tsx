import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';

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
    callbacks: GraphNodeCallbacks;
    fields: { [key: string]: unknown };
}

function GraphNodeField<Ctx, Params>({ nodeId, context, fieldName, fieldConfig, fields, callbacks }: Props<Ctx, Params>) {
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
    const inputNode = useMemo(() => {
        if (!inputComponent) {
            return 'Unknown Input Type';
        }

        // properties to pass to the input component
        const inputProps: InputProps<unknown> = {
            value: fieldValue,
            fieldName,
            nodeId,
            params: fieldParams,
            callbacks,
            onChanged: handleChanged
        };

        return React.createElement(inputComponent, inputProps);
    }, [fieldValue, fieldName, nodeId, fieldParams, callbacks, handleChanged]);

    return (
        <div className={cn("ngraph-node-field", { hidden: fieldParams.hidden })}>
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                {inputNode}
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField) as typeof GraphNodeField;
