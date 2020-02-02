import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { RowGroup, RowsValue, RowGroupsValue, ValueType, createRowGroupsValue } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

const PORT_ROWS = 'rows';
const PORT_GROUPS = 'groups';

class GroupNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly alias: string,
        private readonly groupMapper: expressions.Mapper,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.GROUP_BY;
    }
    
    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(port: string, sub: (value: unknown) => void) {
        if (port === PORT_GROUPS) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        if (!this.subs.length) return;

        const input = value as RowsValue | RowGroupsValue;
        const groups: RowGroup[] = [];
        
        // rows
        if (input.type === ValueType.ROWS) {
            const groupsLookup = new Map<string, RowGroup>();
            const rows = input.rows;

            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];
                const ctx = rowToEvalContext(row, i, this.context);
                const groupName = asString(this.groupMapper(ctx));

                if (groupName) {
                    let groupRow: RowGroup | undefined = groupsLookup.get(groupName);

                    if (!groupRow) {
                        groupRow = {
                            selection: {
                                [this.alias]: groupName
                            },
                            rows: []
                        };

                        groups.push(groupRow);
                        groupsLookup.set(groupName, groupRow);
                    }

                    groupRow.rows.push(row);
                }
            }

        // row-groups
        } else {
            const groups = input.groups;

            for (let i = 0, n = groups.length; i < n; i++) {
                const group = groups[i];
                const subRows = group.rows;
                const groupsLookup = new Map<string, RowGroup>();
                
                for (let j = 0, n = subRows.length; j < n; j++) {
                    const subRow = subRows[j];
                    const ctx = rowToEvalContext(subRow, j, this.context);
                    const groupName = asString(this.groupMapper(ctx));

                    if (groupName) {
                        let groupRow: RowGroup | undefined = groupsLookup.get(groupName);

                        if (!groupRow) {
                            groupRow = {
                                selection: {
                                    ...group.selection,
                                    [this.alias]: groupName
                                },
                                rows: []
                            };

                            groups.push(groupRow);
                            groupsLookup.set(groupName, groupRow);
                        }

                        groupRow.rows!.push(subRow);
                    }
                }
            }
        }

        for (const sub of this.subs) {
            sub(createRowGroupsValue(groups));
        }
    }
}

export const GROUP_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    description: 'Groups the rows by a key.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: [
                    'row[]',
                    'rowgroup[]'
                ]
            }
        },
        out: {
            [PORT_GROUPS]: {
                type: 'rowgroup[]'
            }
        }
    },
    fields: {
        group: {
            label: 'Map Group',
            initialValue: columnExpression(''),
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                columns: context.groupColumns ?? context.columns,
                target: 'row'
            })
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            type: FieldInputType.TEXT
        }
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const mapGroupExpr = node.fields.group as ColumnMapperInputValue;
        const groupMapper = expressions.compileColumnMapper(mapGroupExpr, 'row');
        return new GroupNodeProcessor(alias, groupMapper, params.variables);
    },
    mapContext(node, context): ChartContext {
        const alias = node.fields.alias as string;

        if (context.groupColumns) {
            const columns = pushDistinct(context.columns, alias);
            return {
                columns,
                groupColumns: context.groupColumns
            };

        } else {
            const columns = [alias];
            return {
                columns,
                groupColumns: context.columns
            };
        }
    }
};
