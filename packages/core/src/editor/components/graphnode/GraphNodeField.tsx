import React, { useCallback, useMemo } from 'react';

import { GraphNodeFieldConfig, GraphFieldInputConfig } from '../../../types/graphConfigTypes';
import { FieldInputProps, GraphNodeContext } from '../../../types/graphFieldInputTypes';
import { GraphActionType } from '../../../types/graphReducerTypes';
import { useGraphContext } from '../../graphEditorContext';
import { resolve } from '../../../utils/graph/inputUtils';

type Props<Ctx, Params> = {
    nodeId: string;
    nodeContext: GraphNodeContext<Ctx, Params>;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx, Params>;
    fieldValue: unknown;
}

function GraphNodeField<Ctx, Params>(props: Props<Ctx, Params>) {
    const { nodeId, fieldName, nodeContext, fieldConfig, fieldValue } = props;
    const fieldEditor = fieldConfig.type;
    
    const { graphConfig, dispatch } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[fieldEditor];
    
    const onChanged = useCallback((value: unknown) => {
        dispatch({ type: GraphActionType.SET_FIELD_VALUE, nodeId, fieldName, value });
    }, [dispatch, nodeId, fieldName]);

    const fieldParams = fieldConfig.params;
    const params = useMemo(() => {
        return fieldParams ? resolve(fieldParams, nodeContext) : {};
    }, [fieldParams, nodeContext]);

    const inputProps: FieldInputProps<any> = {
        value: fieldValue,
        params,
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

export default GraphNodeField;
