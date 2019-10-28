import React, { useContext, useCallback } from 'react';
import { GraphNodeFieldSpec } from "../graphTypes";
import { Context } from '../graphContext';

type Props = {
    nodeId: string;
    field: GraphNodeFieldSpec;
    value: unknown;
}

function GraphNodeField({ nodeId, field, value }: Props) {
    const fieldName = field.name;

    const { spec, actions } = useContext(Context);
    const inputSpec = spec.inputs[field.type];
    const onNodeFieldChanged = actions.onNodeFieldChanged;

    const onChanged = useCallback((value: unknown) => {
        onNodeFieldChanged(nodeId, fieldName, value);
    }, [nodeId, fieldName, onNodeFieldChanged]);

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
