import React from 'react';
import { GraphNodeFieldConfig } from '../../types/graphConfigTypes';
import GraphNodeField from './GraphNodeField';

type Props = {
    nodeId: string;
    fieldSpecs: {
        [name: string]: GraphNodeFieldConfig;
    };
    fieldValues: {
        [name: string]: unknown;
    };
}

function GraphNodeFields(props: Props): React.ReactElement {
    const fieldSpecs = props.fieldSpecs;
    const fieldValues = props.fieldValues;
    const nodeId = props.nodeId;

    return (
        <div className="graph-node-fields">
            {Object.entries(fieldSpecs).map(([fieldName, fieldSpec]) => {
                const fieldValue = fieldValues[fieldName];
                return (
                    <GraphNodeField
                        key={fieldName}
                        nodeId={nodeId}
                        fieldName={fieldName}
                        fieldConfig={fieldSpec}
                        fieldValue={fieldValue}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodeFields);
