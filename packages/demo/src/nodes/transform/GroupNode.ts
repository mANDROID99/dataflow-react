import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/converters";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const GROUP_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    ports: {
        in: {
            rows: {
                type: 'row[]'
            }
        },
        out: {
            groups: {
                type: 'row[]'
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
    createProcessor({ node, params }) {
        const mapGroupExpr = node.fields.group as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const mapGroup = expressionUtils.compileColumnMapper(mapGroupExpr, 'row');

        return (inputs, next) => {
            const allRows = inputs.rows as Row[][];
            const rows = allRows[0] ?? [];

            const groupsLookup = new Map<string, Row>();
            const groups: Row[] = [];

            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];
                const subRows = row.group;

                if (subRows) {
                    const groupsLookup = new Map<string, Row>();
                    
                    for (let j = 0, n = subRows.length; j < n; j++) {
                        const subRow = subRows[j];
                        const ctx = rowToEvalContext(subRow, j, params.variables);
                        const groupName = asString(mapGroup(ctx));

                        if (groupName) {
                            let groupRow: Row | undefined = groupsLookup.get(groupName);

                            if (!groupRow) {
                                groupRow = {
                                    values: {
                                        ...row.values,
                                        [alias]: groupName
                                    },
                                    group: []
                                };

                                groups.push(groupRow);
                                groupsLookup.set(groupName, groupRow);
                            }

                            groupRow.group!.push(subRow);
                        }
                    }

                } else {
                    const ctx = rowToEvalContext(row, i, params.variables);
                    const groupName = asString(mapGroup(ctx));

                    if (groupName) {
                        let groupRow: Row | undefined = groupsLookup.get(groupName);

                        if (!groupRow) {
                            groupRow = {
                                values: {
                                    [alias]: groupName
                                },
                                group: []
                            };

                            groups.push(groupRow);
                            groupsLookup.set(groupName, groupRow);
                        }

                        groupRow.group!.push(row);
                    }
                }
            }

            next('groups', groups);
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
