import { RowGroup, DataType, Row, Scalar, createScalar, createRowGroup } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

export const GROUP_NODE: GraphNodeConfig = {
    title: 'Group',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                initialValue: [],
                match: ['row[]', 'rowgroup[]']
            }
        },
        out: {
            groupNames: {
                type: 'scalar[]'
            },
            groups: {
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
            const data = input.in as Row[] | RowGroup[];

            const groups: RowGroup[] = [];
            const groupNames: Scalar[] = [];
            let groupsLookup = new Map<string, RowGroup>();

            for (const row of data) {
                if (row.type === DataType.ROW) {
                    const groupName = row.data[groupKey];
                    if (groupName !== undefined) {
                        let group: RowGroup | undefined = groupsLookup.get(groupName);
                        if (!group) {
                            const correlationId = groupName;
                            group = createRowGroup(correlationId, row.parent, []);
                            groupNames.push(createScalar(correlationId, row.parent, groupName));

                            groups.push(group);
                            groupsLookup.set(groupName, group);
                        }
                        group.rows.push(row);
                    }

                } else {
                    groupsLookup = new Map<string, RowGroup>();
                    for (const subRow of row.rows) {
                        const groupName = subRow.data[groupKey];
                        
                        if (groupName !== undefined) {
                            let group: RowGroup | undefined = groupsLookup.get(groupName);
                            if (!group) {
                                const correlationId = groupName;
                                const parent = row.parent.concat(row.correlationId);

                                group = createRowGroup(correlationId, parent, []);
                                groupNames.push(createScalar(correlationId, parent, groupName));

                                groups.push(group);
                                groupsLookup.set(groupName, group);
                            }
                            group.rows.push(subRow);
                        }
                    }
                }
            }

            next('groups', groups);
            next('groupNames', groupNames);
        }
    }
}

