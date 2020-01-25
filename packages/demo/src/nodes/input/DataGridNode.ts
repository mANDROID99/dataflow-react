import { GraphNodeConfig, FieldInputType, emptyDataGrid, DataGridInputValue } from "@react-ngraph/core";
import { ChartContext } from "../../chartContext";
import { Row } from "../../types/valueTypes";

export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Data-Grid',
    menuGroup: 'Input',
    fields: {
        data: {
            label: 'Data',
            type: FieldInputType.DATA_GRID,
            initialValue: emptyDataGrid()
        }
    },
    ports: {
        in: {},
        out: {
            rows: {
                type: 'row[]'
            }
        }
    },
    createProcessor({ node }) {
        return (inputs, next) => {
            const configData = node.fields.data as DataGridInputValue;  
            const columnNames = configData.columns;
            const rowValues = configData.rows;

            const data: Row[] = rowValues.map((values): Row => {
                const data: { [key: string]: string } = {};
                
                for (let i = 0, n = Math.min(columnNames.length, values.length); i < n; i++) {
                    data[columnNames[i]] = values[i];
                }

                return {
                    values: data
                };
            });

            next('rows', data);
        };
    },
    mapContext({ node }): ChartContext {
        const data = node.fields.data as DataGridInputValue;
        return {
            columns: data.columns
        };
    }
};
