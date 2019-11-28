import { GraphNodeProcessor, Row, createRow } from "./nodeDataTypes";
import { GraphNodeConfig, GraphNodeRole } from "../types/graphConfigTypes";
import { emptyDataGrid, DataGridValue } from "../editor/components/editors/DataGridEditor";
import { EditorType } from "../editor/components/editors/standardEditors";

type Output = {
    out: Row[];
}

type Config = {
    data: DataGridValue;
}

export const DATA_GRID_NODE: GraphNodeConfig<{}, Output, Config> = {
    title: 'Grid',
    role: GraphNodeRole.INPUT,
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
    createProcessor(config) {
        const columnNames = config.data.columns.map(column => column.name);
        const rowValues = config.data.rows;
        return new DataGridProcessor('grid', columnNames, rowValues)
    }
}

export class DataGridProcessor implements GraphNodeProcessor<{}, Output> {
    private readonly gridId: string;
    private readonly columnNames: string[];
    private readonly rowValues: string[][];

    constructor(gridId: string, columnNames: string[], rowValues: string[][]) {
        this.gridId = gridId;
        this.columnNames = columnNames;
        this.rowValues = rowValues;
    }

    process(input: {}, next: (out: Output) => void): void {
        const columnNames = this.columnNames;
        const gridId = this.gridId;
        const data: Row[] = this.rowValues.map((values, index): Row => {
            const data: { [key: string]: string } = {};
            for (let i = 0, n = Math.min(columnNames.length, values.length); i < n; i++) {
                data[columnNames[i]] = values[i];
            }
            return createRow('' + index, [gridId], data);
        });
        next({ out: data });
    }
}
