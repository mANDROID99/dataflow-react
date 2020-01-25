import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row, RowGroup, Rows, RowGroups, ValueType, createRowGroups, EMPTY_ROWS } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const GROUP_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    ports: {
        in: {
            rows: {
                type: [
                    'row[]',
                    'rowgroup[]'
                ]
            }
        },
        out: {
            groups: {
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
    createProcessor({ next, node, params }) {
        const mapGroupExpr = node.fields.group as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const mapGroup = expressionUtils.compileColumnMapper(mapGroupExpr, 'row');

        return {
            onNext(inputs) {
                const input = (inputs.rows[0] || EMPTY_ROWS) as Rows | RowGroups;
                const groups: RowGroup[] = [];
                
                // rows
                if (input.type === ValueType.ROWS) {
                    const groupsLookup = new Map<string, RowGroup>();
                    const rows = input.rows;

                    for (let i = 0, n = rows.length; i < n; i++) {
                        const row = rows[i];
                        const ctx = rowToEvalContext(row, i, params.variables);
                        const groupName = asString(mapGroup(ctx));
    
                        if (groupName) {
                            let groupRow: RowGroup | undefined = groupsLookup.get(groupName);

                            if (!groupRow) {
                                groupRow = {
                                    selection: {
                                        [alias]: groupName
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
                            const ctx = rowToEvalContext(subRow, j, params.variables);
                            const groupName = asString(mapGroup(ctx));

                            if (groupName) {
                                let groupRow: RowGroup | undefined = groupsLookup.get(groupName);

                                if (!groupRow) {
                                    groupRow = {
                                        selection: {
                                            ...group.selection,
                                            [alias]: groupName
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

                next('groups', createRowGroups(groups));
            }
        };
    },
    mapContext({ node, context }): ChartContext {
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
