import { BaseNodeProcessor, GraphNodeConfig, InputType } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { KEY_GROUP, Row } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/conversions";

const PORT_IN_ROWS = 'rows';
const PORT_OUT_GROUPS = 'groups';
const FIELD_GROUP_KEY = 'group';

type Config = {
    groupKey: string;
}

class GroupNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_IN_ROWS) {
            const rows = values[0] as Row[];
            const result: Row[] = [];

            const groupsLookup = new Map<string, Row>();
            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];
                const subRows = row[KEY_GROUP];

                if (subRows) {
                    const subGroupsLookup = new Map<string, Row>();

                    for (let j = 0, m = subRows.length; j < m; j++) {
                        const subRow = subRows[j];
                        const groupName = asString(subRow[this.config.groupKey]);

                        if (groupName) {
                            let groupRow: Row | undefined = subGroupsLookup.get(groupName);

                            if (!groupRow) {
                                groupRow = {
                                    ...row,
                                    [this.config.groupKey]: groupName,
                                    [KEY_GROUP]: []
                                };

                                result.push(groupRow);
                                subGroupsLookup.set(groupName, groupRow);
                            }

                            groupRow[KEY_GROUP]!.push(subRow);
                        }
                    }

                } else {
                    const groupName = asString(row[this.config.groupKey]);
                    if (groupName) {
                        let groupRow: Row | undefined = groupsLookup.get(groupName);

                        if (!groupRow) {
                            groupRow = {
                                [this.config.groupKey]: groupName,
                                [KEY_GROUP]: []
                            };

                            result.push(groupRow);
                            groupsLookup.set(groupName, groupRow);
                        }

                        groupRow[KEY_GROUP]!.push(row);
                    }
                }
            }
            
            this.emitResult(PORT_OUT_GROUPS, result);
        }
    }
}

export const GROUP_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    description: 'Groups the rows by a key.',
    ports: {
        in: {
            [PORT_IN_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_OUT_GROUPS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        group: {
            label: 'Group Key',
            initialValue: '',
            type: InputType.SELECT,
            params: ({ context }) => ({
                options: context.groupColumns ?? context.columns
            })
        }
    },
    mapContext({ node, context }) {
        const groupKey = node.fields[FIELD_GROUP_KEY] as string;
        if (context.groupColumns) {
            const columns = pushDistinct(context.columns, groupKey);
            return {
                columns,
                groupColumns: context.groupColumns
            };

        } else {
            const columns = [groupKey];
            return {
                columns,
                groupColumns: context.columns
            };
        }
    },
    createProcessor(node, params) {
        const groupKey = node.fields[FIELD_GROUP_KEY] as string;
        return new GroupNodeProcessor(params, { groupKey });
    }
};
