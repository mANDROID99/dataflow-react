import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { KEY_GROUP, Row } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/conversions";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { getContextsForPorts, mergeContextsArray } from "../../chartContext";

const PORT_ROWS = 'rows';
const PORT_GROUPS = 'groups';

type Config = {
    alias: string;
    mapGroup: expressions.Mapper
}

class GroupNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName !== PORT_ROWS) {
            return;
        }

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
                    const ctx = rowToEvalContext(subRow, j, this.params.variables);
                    const groupName = asString(this.config.mapGroup(ctx));

                    if (groupName) {
                        let groupRow: Row | undefined = subGroupsLookup.get(groupName);

                        if (!groupRow) {
                            groupRow = {
                                ...row,
                                [this.config.alias]: groupName,
                                [KEY_GROUP]: []
                            };

                            result.push(groupRow);
                            subGroupsLookup.set(groupName, groupRow);
                        }

                        groupRow[KEY_GROUP]!.push(subRow);
                    }
                }

            } else {
                const ctx = rowToEvalContext(row, i, this.params.variables);
                const groupName = asString(this.config.mapGroup(ctx));

                if (groupName) {
                    let groupRow: Row | undefined = groupsLookup.get(groupName);

                    if (!groupRow) {
                        groupRow = {
                            [this.config.alias]: groupName,
                            [KEY_GROUP]: []
                        };

                        result.push(groupRow);
                        groupsLookup.set(groupName, groupRow);
                    }

                    groupRow[KEY_GROUP]!.push(row);
                }
            }
        }
        
        this.emitResult(PORT_ROWS, result);
    }
}

export const GROUP_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Group-By',
    menuGroup: 'Transform',
    description: 'Groups the rows by a key.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_GROUPS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        group: {
            label: 'Map Group',
            initialValue: columnExpression(''),
            type: InputType.COLUMN_MAPPER,
            params: {
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context ? context.groupColumns ?? context.columns : undefined
            })
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            type: InputType.TEXT
        }
    },
    computeContext: {
        compute({ node }, contexts) {
            const context = mergeContextsArray(contexts);
            if (!context) return;

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
        },
        deps({ node, contexts }) {
            return getContextsForPorts(node.ports.in, contexts);
        }
    },
    createProcessor(node, params) {
        const alias = node.fields.alias as string;
        const mapGroupExpr = node.fields.group as ColumnMapperInputValue;
        const mapGroup = expressions.compileColumnMapper(mapGroupExpr, 'row');
        return new GroupNodeProcessor(params, { alias, mapGroup });
    }
};
