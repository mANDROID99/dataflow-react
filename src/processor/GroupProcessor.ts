import { RowGroup, GraphNodeProcessor, DataType, Row, Scalar, createScalar, createRowGroup } from "./processorTypes";

type Input = {
    in: Row[] | RowGroup[] | undefined;
}

type Output = {
    groupNames: Scalar[];
    groups: RowGroup[];
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

        if (data) {
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

