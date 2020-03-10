import React, { useCallback, useMemo } from "react";
import { GraphNodeConfig, GraphNodeFieldConfig } from "../../../types/graphConfigTypes";
import { GraphNodeActions } from "../../../types/graphNodeComponentTypes";
import GraphNodeField from "./GraphNodeField";
import GraphNodeFieldGroup from "./GraphNodeFieldGroup";

type Props<C, P> = {
    fields: {
        [name: string]: unknown;
    };
    context: C;
    nodeConfig: GraphNodeConfig<C, P>;
    actions: GraphNodeActions;
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
    const { fields, context, nodeConfig, actions } = props;
    const fieldGroups = useMemo(() => resolveFieldGroups(nodeConfig.fields), [nodeConfig.fields]);

    const handleFieldChanged = useCallback((fieldName: string, value: unknown) => {
        actions.setFieldValue(fieldName, value);
    }, [actions]);

    function renderFields(group: { [key: string]: GraphNodeFieldConfig<C, P> }) {
        return Object.entries(group).map(([fieldName, fieldConfig]) => (
                <GraphNodeField<C, P>
                    key={fieldName}
                    context={context}
                    fieldName={fieldName}
                    fieldConfig={fieldConfig}
                    fieldValue={fields[fieldName]}
                    fieldValues={fields}
                    actions={actions}
                    onChanged={handleFieldChanged}
                />
            ));
    }

    return (
        <div className="ngraph-node-fields">
            {Array.from(fieldGroups.entries()).map(([groupName, group], index) => {
                if (groupName !== null) {
                    return (
                        <GraphNodeFieldGroup
                            {...props}
                            key={index}
                            group={group}
                            groupName={groupName}
                            onChanged={handleFieldChanged}
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
