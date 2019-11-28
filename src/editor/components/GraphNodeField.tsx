import React, { useContext, useCallback } from 'react';
import { GraphNodeFieldConfig, GraphNodeEditorConfig } from '../../types/graphConfigTypes';
import { graphContext } from './GraphEditor';
import { GraphFieldEditorProps } from '../../types/graphEditorTypes';
import { useDispatch } from 'react-redux';
import { setFieldValue } from '../editorActions';

type Props<T> = {
    nodeId: string;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<T>;
    fieldValue: unknown;
}

function GraphNodeField<T>(props: Props<T>): React.ReactElement {
    const { nodeId, fieldName, fieldConfig, fieldValue } = props;
    const fieldEditor = fieldConfig.editor;
    
    const { graphConfig, graphId, ctx } = useContext(graphContext);
    const input: GraphNodeEditorConfig<any> | undefined = graphConfig.editors[fieldEditor];
    
    const dispatch = useDispatch();
    const onChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(graphId, nodeId, fieldName, value));
    }, [dispatch, graphId, nodeId, fieldName]);

    const inputProps: GraphFieldEditorProps<any> = {
        onChanged,
        value: fieldValue,
        ctx,
        field: fieldConfig
    };

    return (
        <div className="graph-node-field">
            <div className="graph-node-field-label">{ fieldConfig.label }</div>
            <div className="graph-node-field-input">
                { input ? React.createElement(input.component, inputProps) : 'Unknown Input Type' }
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField);
