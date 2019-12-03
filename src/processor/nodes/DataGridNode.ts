import { Row, createRow } from "../../types/processorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { emptyDataGrid, DataGridValue } from "../../editor/components/editors/DataGridEditor";
import { EditorType } from "../../editor/components/editors/standardEditors";
import { ChartContext } from "./context";

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
