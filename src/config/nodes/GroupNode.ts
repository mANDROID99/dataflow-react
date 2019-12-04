import { DataType, RowGroup, Row, createRowGroup, Primitive } from "../nodeDataTypes";
import { GraphNodeConfig } from "graph/types/graphConfigTypes";
import { EditorType } from "graph/editor/editors/standardEditors";
import { ChartContext } from "./chartContext";

function toString(x: Primitive) {
    return x === undefined ? '' : '' + x;
}

export const GROUP_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                label: 'in',
                initialValue: [],
                match: ['row[]', 'rowgroup[]']
            }
        },
        out: {
            data: {
                label: 'data',
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
        key: {
            label: 'Key',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    process({ node }) {
        const groupKey = node.fields.column as string;
        const key = node.fields.key as string;

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
                            group.selection = { [key]: groupName };

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
                                group.selection = { ...datum.selection, [key]: groupName };

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
    },
    modifyContext({ node, context }) {
        const key = node.fields.key as string;
        context.keys.push(key);
    }
};
