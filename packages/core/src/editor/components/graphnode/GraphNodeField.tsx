import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { GraphNodeFieldConfig } from '../../../types/graphConfigTypes';
import { FieldInputProps, GraphFieldInputConfig, ComputedField } from '../../../types/graphInputTypes';
import { useGraphContext } from '../../graphEditorContext';
import { setNodeFieldValue } from '../../../store/actions';

type Props<Ctx, Params> = {
    nodeId: string;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx, Params>;
    fieldComputed: ComputedField;
}

function GraphNodeField<Ctx, Params>(props: Props<Ctx, Params>) {
    const { nodeId, fieldName, fieldConfig, fieldComputed } = props;
    const fieldEditor = fieldConfig.type;
    
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[fieldEditor];
    
    const onChanged = useCallback((value: unknown) => {
        dispatch(setNodeFieldValue(nodeId, fieldName, value));
    }, [dispatch, nodeId, fieldName]);

    const inputProps: FieldInputProps<any> = {
        value: fieldComputed.value,
        params: fieldComputed.params,
        fieldName,
        nodeId,
        onChanged
    };

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-node-field-label">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                { input ? React.createElement(input.component, inputProps) : 'Unknown Input Type' }
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField) as typeof GraphNodeField;
