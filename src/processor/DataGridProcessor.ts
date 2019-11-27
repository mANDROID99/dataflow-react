import { GraphNodeProcessor, Row, createRow } from "./processorTypes";

type Output = {
    out: Row[];
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
