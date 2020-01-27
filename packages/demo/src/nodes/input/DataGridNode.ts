import { GraphNodeConfig, FieldInputType, emptyDataGrid, DataGridInputValue, Processor } from "@react-ngraph/core";
import { ChartContext } from "../../chartContext";
import { Row, createRows } from "../../types/valueTypes";

export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Data-Grid',
    menuGroup: 'Input',
    description: 'Data-Grid of values.',
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
    createProcessor({ node, next }): Processor {
        return {
            onStart() {
                const configData = node.fields.data as DataGridInputValue;  
                const columnNames = configData.columns;
                const rowValues = configData.rows;

                const data: Row[] = rowValues.map((values): Row => {
                    const data: { [key: string]: string } = {};
                    const nRows = Math.min(columnNames.length, values.length);
                    
                    for (let i = 0; i < nRows; i++) {
                        data[columnNames[i]] = values[i];
                    }

                    return data;
                });

                next('rows', createRows(data));
            }
        };
    },
    mapContext({ node }): ChartContext {
        const data = node.fields.data as DataGridInputValue;
        return {
            columns: data.columns
        };
    }
};
