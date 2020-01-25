import { GraphNodeConfig, FieldInputType, columnExpression, ColumnMapperInputValue, expressionUtils } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row, createRows, RowGroups } from "../../types/valueTypes";
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
                type: 'rowgroup[]'
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
    createProcessor({ next, node, params }) {
        const columnExpr = node.fields.column as ColumnMapperInputValue;
        const alias = node.fields.alias as string;
        const type = node.fields.type as AggregatorType;
        const mapColumn = expressionUtils.compileColumnMapper(columnExpr, 'row');

        return {
            onNext(inputs) {
                const rg = (inputs.groups[0] || []) as RowGroups;
                const rows: Row[] = [];
                const aggregator = createAggregator(type);
    
                const rowGroups = rg.groups;
                for (let i = 0, n = rowGroups.length; i < n; i++) {
                    const rowGroup = rowGroups[i];
                    const subRows = rowGroup.rows;
                    let subAmt: number | undefined = undefined;

                    for (let j = 0, m = subRows.length; j < m; j++) {
                        const subRow = subRows[j];
                        const ctx = rowToEvalContext(subRow, j, params.variables);
                        const value = asNumber(mapColumn(ctx));
                        subAmt = aggregator(subAmt, value, j);
                    }

                    rows.push({
                        ...rowGroup.selection,
                        [alias]: subAmt
                    });
                }
                
                next('rows', createRows(rows));
            }
        }
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
