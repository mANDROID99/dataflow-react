import { RowGroup, DataType, Row, Scalar, createScalarValue, createRowGroupValue, NodeValue } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

export const GROUP_NODE: GraphNodeConfig = {
    title: 'Group-By',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                initialValue: [],
                match: ['row[]', 'rowgroup[]']
            }
        },
        out: {
            name: {
                type: 'scalar[]'
            },
            group: {
                type: 'rowgroup[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.TEXT 
        }
    },
    process(config) {
        const groupKey = config.column as string;

        return (input, next) => {
            const data = input.in as NodeValue<Row>[] | NodeValue<RowGroup>[];

            const groups: NodeValue<RowGroup>[] = [];
            const groupNames: NodeValue<Scalar>[] = [];
            let groupsLookup = new Map<string, NodeValue<RowGroup>>();

            for (const value of data) {
                const datum = value.data;
                if (datum.type === DataType.ROW) {
                    const groupName = datum.data[groupKey];
                    if (groupName !== undefined) {
                        let group: NodeValue<RowGroup> | undefined = groupsLookup.get(groupName);
                        if (!group) {
                            const correlationId = groupName;
                            group = createRowGroupValue(correlationId, value.parent, []);
                            groupNames.push(createScalarValue(correlationId, value.parent, groupName));

                            groups.push(group);
                            groupsLookup.set(groupName, group);
                        }
                        group.data.rows.push(datum);
                    }

                } else {
                    groupsLookup = new Map<string, NodeValue<RowGroup>>();
                    for (const subRow of datum.rows) {
                        const groupName = subRow.data[groupKey];
                        
                        if (groupName !== undefined) {
                            let group: NodeValue<RowGroup> | undefined = groupsLookup.get(groupName);
                            if (!group) {
                                const correlationId = groupName;
                                const parent = value.parent.concat(value.correlationId);

                                group = createRowGroupValue(correlationId, parent, []);
                                groupNames.push(createScalarValue(correlationId, parent, groupName));

                                groups.push(group);
                                groupsLookup.set(groupName, group);
                            }
                            group.data.rows.push(subRow);
                        }
                    }
                }
            }

            next('group', groups);
            next('name', groupNames);
        };
    }
};
