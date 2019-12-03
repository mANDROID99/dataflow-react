import { DataType, RowGroup, Row, createRowGroup, Primitive } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

function toString(x: Primitive) {
    return x === undefined ? '' : '' + x;
}

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
            data: {
                type: 'rowgroup[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.TEXT 
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    process({ config }) {
        const groupKey = config.column as string;
        const alias = config.alias as string;

        return (input, next) => {
            const data = input.in as Row[] | RowGroup[];

            const groups: RowGroup[] = [];
            let groupsLookup = new Map<string, RowGroup>();

            for (const datum of data) {
                if (datum.type === DataType.ROW) {
                    const groupName = toString(datum.data[groupKey]);
                    if (groupName !== undefined) {
                        let group: RowGroup | undefined = groupsLookup.get(groupName);

                        if (!group) {
                            group = createRowGroup(groupName, []);
                            group.selection = { [alias]: groupName };

                            groups.push(group);
                            groupsLookup.set(groupName, group);
                        }

                        group.data.push(datum);
                    }

                } else {
                    groupsLookup = new Map<string, RowGroup>();
                    for (const subRow of datum.data) {
                        const groupName = toString(subRow.data[groupKey]);
                        
                        if (groupName !== undefined) {
                            let group: RowGroup | undefined = groupsLookup.get(groupName);

                            if (!group) {
                                group = createRowGroup(datum.rowId + '-' + groupName, []);
                                group.selection = { ...datum.selection, [alias]: groupName };

                                groups.push(group);
                                groupsLookup.set(groupName, group);
                            }

                            group.data.push(subRow);
                        }
                    }
                }
            }

            next('data', groups);
        };
    }
};
