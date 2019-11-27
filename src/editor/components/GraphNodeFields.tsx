import React from 'react';
import { GraphNodeFieldConfig } from '../../types/graphConfigTypes';
import GraphNodeField from './GraphNodeField';

type Props = {
    nodeId: string;
    fieldSpecs: GraphNodeFieldConfig[] | undefined;
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
            { (fieldSpecs || []).map((fieldSpec: GraphNodeFieldConfig) => {
                const fieldName = fieldSpec.name;
                const fieldValue = fieldValues[fieldName];
                return (
                    <GraphNodeField
                        key={fieldName}
                        nodeId={nodeId}
                        fieldSpec={fieldSpec}
                        fieldValue={fieldValue}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodeFields);
