import { Row, createRow } from "../nodeDataTypes";
import { GraphNodeConfig } from "graph/types/graphConfigTypes";
import { emptyDataGrid, DataGridValue } from "graph/editor/editors/DataGridEditor";
import { EditorType } from "graph/editor/editors/standardEditors";
import { ChartContext } from "./chartContext";

export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Grid',
    menuGroup: 'Input',
    fields: {
        data: {
            label: 'Data',
            editor: EditorType.DATA_GRID,
            initialValue: emptyDataGrid()
        }
    },
    ports: {
        in: {},
        out: {
            out: {
                label: 'Out',
                type: 'row[]'
            }
        }
    },
    process({ node }) {
        const configData = node.fields.data as DataGridValue;  
        const columnNames = configData.columns.map(column => column.name);
        const rowValues = configData.rows;

        return (input, next) => {
            const data: Row[] = rowValues.map((values, index): Row => {
                const data: { [key: string]: string } = {};
                for (let i = 0, n = Math.min(columnNames.length, values.length); i < n; i++) {
                    data[columnNames[i]] = values[i];
                }
                return createRow('' + index, data);
            });

            next('out', data);
        };
    },
    modifyContext({ node, context }) {
        const columns = context.columns;
        const data = node.fields.data as DataGridValue;
        data.columns.forEach(column => columns.push(column.name));
    }
};
