import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { KEY_GROUP, ValueType, Row } from "../../types/valueTypes";
import { pushDistinct } from "../../utils/arrayUtils";
import { asString } from "../../utils/conversions";
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

        const rows = value as Row[];
        const result: Row[] = [];

        const groupsLookup = new Map<string, Row>();
        for (let i = 0, n = rows.length; i < n; i++) {
            const row = rows[i];
            const subRows = row[KEY_GROUP];

            if (subRows) {
                const subGroupsLookup = new Map<string, Row>();

                for (let j = 0, m = subRows.length; j < m; j++) {
                    const subRow = subRows[j];
                    const ctx = rowToEvalContext(subRow, j, this.context);
                    const groupName = asString(this.groupMapper(ctx));

                    if (groupName) {
                        let groupRow: Row | undefined = subGroupsLookup.get(groupName);

                        if (!groupRow) {
                            groupRow = {
                                ...row,
                                [this.alias]: groupName,
                                [KEY_GROUP]: []
                            };

                            result.push(groupRow);
                            subGroupsLookup.set(groupName, groupRow);
                        }

                        groupRow[KEY_GROUP]!.push(subRow);
                    }
                }

            } else {
                const ctx = rowToEvalContext(row, i, this.context);
                const groupName = asString(this.groupMapper(ctx));

                if (groupName) {
                    let groupRow: Row | undefined = groupsLookup.get(groupName);

                    if (!groupRow) {
                        groupRow = {
                            [this.alias]: groupName,
                            [KEY_GROUP]: []
                        };

                        result.push(groupRow);
                        groupsLookup.set(groupName, groupRow);
                    }

                    groupRow[KEY_GROUP]!.push(row);
                }
            }
        }
        
        for (const sub of this.subs) {
            sub(result);
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
            params: ({ context }) => ({
                columns: context.groupColumns ?? context.columns,
                target: 'row'
            })
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            type: InputType.TEXT
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
