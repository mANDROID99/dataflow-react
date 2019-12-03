import React from 'react';
import { GraphNodeFieldConfig } from '../../types/graphConfigTypes';
import GraphNodeField from './GraphNodeField';

type Props = {
    nodeId: string;
    fieldConfigs: {
        [name: string]: GraphNodeFieldConfig<any>;
    };
    fieldValues: {
        [name: string]: unknown;
    };
}

function GraphNodeFields(props: Props): React.ReactElement {
    const fieldSpecs = props.fieldConfigs;
    const fieldValues = props.fieldValues;
    const nodeId = props.nodeId;

    return (
        <div className="graph-node-fields">
            {Object.entries(fieldSpecs).map(([fieldName, fieldConfig]) => {
                const fieldValue = fieldValues[fieldName];
                return (
                    <GraphNodeField
                        key={fieldName}
                        nodeId={nodeId}
                        fieldName={fieldName}
                        fieldConfig={fieldConfig}
                        fieldValue={fieldValue}
                    />
                );
            })}
        </div>
    );
}

export default React.memo(GraphNodeFields);
