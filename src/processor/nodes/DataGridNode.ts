import { Row, createRowValue, NodeValue } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { emptyDataGrid, DataGridValue } from "../../editor/components/editors/DataGridEditor";
import { EditorType } from "../../editor/components/editors/standardEditors";

export const DATA_GRID_NODE: GraphNodeConfig = {
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
    process(config) {
        const configData = config.data as DataGridValue;  
        const columnNames = configData.columns.map(column => column.name);
        const rowValues = configData.rows;

        return (input, next) => {
            const gridId = 'data-grid';
            const data: NodeValue<Row>[] = rowValues.map((values, index): NodeValue<Row> => {
                const data: { [key: string]: string } = {};
                for (let i = 0, n = Math.min(columnNames.length, values.length); i < n; i++) {
                    data[columnNames[i]] = values[i];
                }
                return createRowValue('' + index, [gridId], data);
            });

            next('out', data);
        };
    }
};
