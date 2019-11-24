import React, { useContext, useCallback } from 'react';
import { GraphNodeFieldSpec, GraphNodeInputSpec } from '../types/graphSpecTypes';
import { graphContext } from './GraphEditor';
import { GraphFieldInputProps } from '../types/graphInputTypes';
import { useDispatch } from 'react-redux';
import { setFieldValue } from '../editorActions';

type Props = {
    nodeId: string;
    fieldSpec: GraphNodeFieldSpec;
    fieldValue: unknown;
}

function GraphNodeField(props: Props): React.ReactElement {
    const { fieldSpec, fieldValue, nodeId } = props;
    const fieldName = fieldSpec.name;
    const fieldType = fieldSpec.type;
    
    const { graphSpec, graphId, ctx } = useContext(graphContext);
    const input: GraphNodeInputSpec | undefined = graphSpec.inputs[fieldType];
    
    const dispatch = useDispatch();
    const onChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(graphId, nodeId, fieldName, value));
    }, [dispatch, graphId, nodeId, fieldName]);

    const inputProps: GraphFieldInputProps = {
        onChanged,
        value: fieldValue,
        ctx,
        fieldSpec
    };

    return (
        <div className="graph-node-field">
            <div className="graph-node-field-label">{ fieldSpec.label }</div>
            <div className="graph-node-field-input">
                { input ? React.createElement(input.component, inputProps) : 'Unknown Input Type' }
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField);
