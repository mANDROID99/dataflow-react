import React, { useContext, useCallback } from 'react';
import { GraphNodeFieldConfig, GraphNodeEditorConfig } from '../../types/graphConfigTypes';
import { graphContext } from './GraphEditor';
import { GraphFieldEditorProps } from '../../types/graphEditorTypes';
import { useDispatch } from 'react-redux';
import { setFieldValue } from '../editorActions';

type Props<Ctx> = {
    nodeId: string;
    fieldName: string;
    fieldConfig: GraphNodeFieldConfig<Ctx>;
    fieldValue: unknown;
}

function GraphNodeField<Ctx>(props: Props<Ctx>): React.ReactElement {
    const { nodeId, fieldName, fieldConfig, fieldValue } = props;
    const fieldEditor = fieldConfig.editor;
    
    const { graphConfig, graphId, baseContext } = useContext(graphContext);
    const input: GraphNodeEditorConfig<Ctx, any> | undefined = graphConfig.editors[fieldEditor];
    
    const dispatch = useDispatch();
    const onChanged = useCallback((value: unknown) => {
        dispatch(setFieldValue(graphId, nodeId, fieldName, value));
    }, [dispatch, graphId, nodeId, fieldName]);

    const inputProps: GraphFieldEditorProps<Ctx, any> = {
        onChanged,
        value: fieldValue,
        context,
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
