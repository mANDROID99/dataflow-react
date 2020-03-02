import React, { useMemo } from "react";

import { GraphNodeConfig, GraphNodeFieldConfig } from "../../../types/graphConfigTypes";
import { GraphNodeActions } from "../../../types/graphNodeComponentTypes";
import GraphNodeField from "./GraphNodeField";
import GraphNodeFieldGroup from "./GraphNodeFieldGroup";

type Props<C, P> = {
    nodeId: string;
    fields: {
        [name: string]: unknown;
    };
    context: C | undefined;
    nodeConfig: GraphNodeConfig<C, P>;
    actions: GraphNodeActions<C>;
}

function resolveFieldGroups<C, P>(fields: { [key: string]: GraphNodeFieldConfig<C, P> }) {
    const groups = new Map<string | null, { [key: string]: GraphNodeFieldConfig<C, P> }>();

    for (const fieldId in fields) {
        const field = fields[fieldId];
        const groupName = field.fieldGroup ?? null;
        let group = groups.get(groupName);

        if (!group) {
            group = {};
            groups.set(groupName, group);
        }

        group[fieldId] = field;
    }

    return groups;
}

function GraphNodeFieldGroups<C, P>(props: Props<C, P>) {
    const { nodeId, fields, context, nodeConfig, actions } = props;
    const fieldGroups = useMemo(() => resolveFieldGroups(nodeConfig.fields), [nodeConfig.fields]);

    function renderFields(group: { [key: string]: GraphNodeFieldConfig<C, P> }) {
        return Object.entries(group).map(([fieldName, fieldConfig]) => {
            return (
                <GraphNodeField<C, P>
                    key={fieldName}
                    nodeId={nodeId}
                    context={context}
                    fieldName={fieldName}
                    fieldConfig={fieldConfig}
                    actions={actions}
                    fields={fields}
                />
            );
        });
    }

    return (
        <div className="ngraph-node-fields">
            {[...fieldGroups.entries()].map(([groupName, group], index) => {
                if (groupName !== null) {
                    return (
                        <GraphNodeFieldGroup
                            key={index}
                            {...props}
                            group={group}
                            groupName={groupName}
                        />
                    );

                } else {
                    return renderFields(group);
                }
            })}
        </div>
    );
}

export default React.memo(GraphNodeFieldGroups) as typeof GraphNodeFieldGroups;
