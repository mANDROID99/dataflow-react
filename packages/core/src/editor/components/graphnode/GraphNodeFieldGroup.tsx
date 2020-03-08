import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { GraphNodeFieldConfig } from '../../../types/graphConfigTypes';
import { GraphNodeActions } from '../../../types/graphNodeComponentTypes';
import Collapse from '../../../common/Collapse';
import GraphNodeField from './GraphNodeField';

type Props<C, P> = {
    context: C;
    groupName: string;
    actions: GraphNodeActions;
    group: { [key: string]: GraphNodeFieldConfig<C, P> };
    fields: { [key: string]: unknown };
    onChanged: (fieldName: string, value: unknown) => void;
};

export default function GraphNodeFieldGroup<C, P>({ context, groupName, actions, group, fields, onChanged }: Props<C, P>) {
    const [collapsed, setCollapsed] = useState(true);

    function renderFields(group: { [key: string]: GraphNodeFieldConfig<C, P> }) {
        return Object.entries(group).map(([fieldName, fieldConfig]) => (
                <GraphNodeField<C, P>
                    key={fieldName}
                    context={context}
                    fieldName={fieldName}
                    fieldValue={fields[fieldName]}
                    fieldConfig={fieldConfig}
                    fieldValues={fields}
                    actions={actions}
                    onChanged={onChanged}
                />
            ));
    }

    const handleToggle = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="ngraph-node-field-group">
            <div className="ngraph-node-field-group-header" onClick={handleToggle}>
                <div className="ngraph-node-field-group-expander">
                    <FontAwesomeIcon icon={collapsed ? "chevron-up" : "chevron-down"}/>
                </div>
                <div className="ngraph-node-field-group-label">
                    {groupName}
                </div>
            </div>
            <Collapse collapsed={collapsed}>
                {renderFields(group)}
            </Collapse>
        </div>
    );
}
