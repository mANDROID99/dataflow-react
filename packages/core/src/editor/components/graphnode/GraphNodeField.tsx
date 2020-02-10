import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig, GraphFieldInputConfig } from '../../../types/graphConfigTypes';
import { InputProps, GraphNodeContext } from '../../../types/graphInputTypes';
import { useGraphContext } from '../../graphEditorContext';
import { setFieldValue } from '../../../store/actions';
import { useFieldParams } from '../../../utils/useFieldParams';

type Props<Ctx, Params> = {
    nodeId: string;
    nodeContext: GraphNodeContext<Ctx, Params>;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx, Params>;
    fields: {
        [key: string]: unknown;
    };
}

function GraphNodeField<Ctx, Params>(props: Props<Ctx, Params>) {
    const { nodeId, fieldName, fieldConfig, fields, nodeContext } = props;
    const inputType = fieldConfig.type;
    
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[inputType];
    
    // resolve next field params using the field config
    const resolverParams = useMemo(() => ({ fields, ...nodeContext }), [fields, nodeContext]);
    const params = useFieldParams(fieldConfig, resolverParams);
    const value = params.value;

    // update the field value in the store when the initial value changed.
    // Only monitor changes.
    const prevValue = useRef(value);
    useEffect(() => {
        if (prevValue.current !== value) {
            prevValue.current = value;
            dispatch(setFieldValue(nodeId, fieldName, value));
        }
    });

    const onChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(nodeId, fieldName, value));
    }, [dispatch, nodeId, fieldName]);
    
    // properties to pass to the input component
    const inputComponent = input?.component;
    const inputProps: InputProps<unknown> = {
        value: fields[fieldName],
        fieldName,
        nodeId,
        params,
        onChanged
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

export default GraphNodeField;
