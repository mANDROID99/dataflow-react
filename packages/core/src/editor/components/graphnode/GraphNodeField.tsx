import React from 'react';
import GraphNodeFieldInput, { FieldInputProps } from './GraphNodeFieldInput';

export default function GraphNodeField<C, P>(props: FieldInputProps<C, P>) {
    const fieldConfig = props.fieldConfig;
    return (
        <div className="ngraph-node-field">
            <div className="ngraph-text-label ngraph-text-ellipsis">{ fieldConfig.label }</div>
            <div className="ngraph-node-field-input">
                <GraphNodeFieldInput {...props}/>
            </div>
        </div>
    );
}
