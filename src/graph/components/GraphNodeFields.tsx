import React from 'react';
import { GraphNodeFieldSpec } from '../types/graphSpecTypes';
import GraphNodeField from './GraphNodeField';

type Props = {
    nodeId: string;
    fieldSpecs: GraphNodeFieldSpec[] | undefined;
    fields: {
        [name: string]: unknown;
    };
}

function GraphNodeFields(props: Props): React.ReactElement {
    const fieldSpecs = props.fieldSpecs;
    const fields = props.fields;
    const nodeId = props.nodeId;

    return (
        <div className="graph-node-fields">
            { (fieldSpecs || []).map((fieldSpec: GraphNodeFieldSpec) => {
                const fieldName = fieldSpec.name;
                const field = fields[fieldName];
                return (
                    <GraphNodeField
                        key={fieldName}
                        nodeId={nodeId}
                        fieldSpec={fieldSpec}
                        fieldValue={field}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodeFields);
