import React, { useCallback, useMemo } from 'react';

import { GraphNodeFieldConfig, GraphFieldInputConfig } from '../../../types/graphConfigTypes';
import { InputProps, GraphNodeContext } from '../../../types/graphInputTypes';
import { useGraphContext } from '../../graphEditorContext';
import { resolve } from '../../../utils/graph/inputUtils';
import { setNodeFieldValue } from '../../../store/actions';
import { useDispatch } from 'react-redux';

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
    
    const dispatch = useDispatch();
    const { graphConfig } = useGraphContext<Ctx, Params>();
    const input: GraphFieldInputConfig | undefined = graphConfig.inputs[fieldEditor];
    
    const onChanged = useCallback((value: unknown) => {
        dispatch(setNodeFieldValue(nodeId, fieldName, value));
    }, [dispatch, nodeId, fieldName]);

    const fieldParams = fieldConfig.params;
    const params = useMemo(() => {
        return fieldParams ? resolve(fieldParams, nodeContext) : {};
    }, [fieldParams, nodeContext]);

    const inputProps: InputProps<any> = {
        value: fieldValue,
        fieldName,
        nodeId,
        params,
        onChanged
    };

    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                { input ? React.createElement(input.component, inputProps) : 'Unknown Input Type' }
            </div>
        </div>
    );
}

export default GraphNodeField;
