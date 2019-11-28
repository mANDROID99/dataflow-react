import { RowGroup, GraphNodeProcessor, DataType, Row, Scalar, createScalar, createRowGroup } from "./nodeDataTypes";
import { GraphNodeConfig } from "../types/graphConfigTypes";
import { EditorType } from "../editor/components/editors/standardEditors";

type Input = {
    in: Row[] | RowGroup[];
}

type Output = {
    groupNames: Scalar[];
    groups: RowGroup[];
}

type Config = {
    column: string;
}

export const GROUP_NODE: GraphNodeConfig<Input, Output, Config> = {
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
    createProcessor(config) {
        return new GroupProcessor(config.column);
    }
}

export class GroupProcessor implements GraphNodeProcessor<Input, Output> {
    private readonly groupKey: string;

    constructor(groupKey: string) {
        this.groupKey = groupKey;
    }

    process(input: Input, next: (out: Output) => void): void {
        const data = input.in;
        const groupKey = this.groupKey;

        const groups: RowGroup[] = [];
        const groupNames: Scalar[] = [];
        let groupsLookup = new Map<string, RowGroup>();

        for (const row of data) {
            if (row.type === DataType.ROW) {
                const groupName = row.data[groupKey];
                if (groupName !== undefined) {
                    let group: RowGroup | undefined = groupsLookup.get(groupName);
                    if (!group) {
                        const correlationId = this.createCorrelationId(groupName);
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
                            const correlationId = this.createCorrelationId(groupName);
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

        next({
            groups,
            groupNames
        });
    }

    private createCorrelationId(groupName: string) {
        return groupName;
    }
}

