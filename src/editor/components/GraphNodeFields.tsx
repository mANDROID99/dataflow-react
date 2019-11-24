import React from 'react';
import { GraphNodeFieldSpec } from '../types/graphSpecTypes';
import GraphNodeField from './GraphNodeField';

type Props = {
    nodeId: string;
    fieldSpecs: GraphNodeFieldSpec[] | undefined;
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
            { (fieldSpecs || []).map((fieldSpec: GraphNodeFieldSpec) => {
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
