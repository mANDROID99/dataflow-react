import React, { useContext, useCallback } from 'react';
import { GraphNodeFieldSpec } from '../types/graphSpecTypes';
import { Context } from '../graphContext';

type Props = {
    nodeId: string;
    field: GraphNodeFieldSpec;
    value: unknown;
}

function GraphNodeField({ nodeId, field, value }: Props) {
    const { spec, actions } = useContext(Context);

    const fieldName = field.name;
    const inputSpec = spec.inputs[field.type];
    const onNodeFieldValueChanged = actions.onNodeFieldValueChanged;

    const onChanged = useCallback((value: unknown) => {
        onNodeFieldValueChanged(nodeId, fieldName, value);
    }, [nodeId, fieldName, onNodeFieldValueChanged]);

    return (
        <div className="graph-node-field">
            <div className="graph-node-field-label">{ field.label }</div>
            <div className="graph-node-field-input">
                { inputSpec ? React.createElement(inputSpec.component, { value, onChanged }) : null }
            </div>
        </div>
    );
}

export default React.memo(GraphNodeField);
