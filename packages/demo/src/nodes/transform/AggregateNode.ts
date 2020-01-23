import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row } from "../../types/nodeTypes";
import { asNumber } from "../../utils/converters";
import { pushDistinct } from "../../utils/arrayUtils";
import { AggregatorType, createAggregator } from "./aggregators";
import { rowToEvalContext } from "../../utils/expressionUtils";

export const AGGREGATE_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Aggregate',
    menuGroup: 'Transform',
    ports: {
        in: {
            groups: {
                type: 'row[]'
            }
        },
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    fields: {
        type: {
            label: 'Agg Type',
            initialValue: 'sum',
            type: FieldInputType.SELECT,
            params: {
                options: Object.values(AggregatorType)
            }
        },
        column: {
            label: 'Map Column',
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
        },
    },
    createProcessor({ node, params }) {
        const columnExpr = node.fields.column as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const type = node.fields.type as AggregatorType;
        const mapColumn = expressionUtils.compileColumnMapper(columnExpr, 'row');

        return (inputs, next) => {
            const allRows = inputs.groups as Row[][];
            const rows = allRows[0] ?? [];
            const result: Row[] = [];

            const aggregator = createAggregator(type);
            let amt: number | undefined;

            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];
                const subRows = row.group;

                if (subRows) {
                    let subAmt: number | undefined = undefined;

                    for (let j = 0, m = subRows.length; j < m; j++) {
                        const subRow = subRows[j];
                        const ctx = rowToEvalContext(subRow, j, params.variables);
                        const value = asNumber(mapColumn(ctx));
                        subAmt = aggregator(subAmt, value, j);
                    }

                    result.push({
                        values: {
                            ...row.values,
                            [alias]: subAmt
                        },
                        group: row.group
                    });

                } else {
                    const ctx = rowToEvalContext(row, i, params.variables);
                    const value = asNumber(mapColumn(ctx));
                    amt = aggregator(amt, value, i);
                }
            }

            if (amt != null) {
                result.push({
                    values: {
                        [alias]: amt
                    },
                    group: rows
                });
            }

            next('rows', result);
        };
    },
    mapContext({ node, context }): ChartContext {
        const alias = node.fields.alias as string;

        if (context.groupColumns) {
            const columns = pushDistinct(context.columns, alias);
            return {
                groupColumns: context.groupColumns,
                columns
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
