import { GraphNodeConfig, InputType, emptyDataGrid, expressions, DataGridInputValue, NodeProcessor } from "@react-ngraph/core";
import { NodeType } from '../nodes';
import { ChartContext } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";

const PORT_ROWS = 'rows';

class DataGridProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly data: DataGridInputValue
    ) { }

    get type(): string {
        return NodeType.DATA_GRID
    }
    
    registerProcessor(): void { }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.subs.push(sub);
        }
    }

    start(): void {
        if (!this.subs.length) return;
        
        const gridColumns = this.data.columns;
        const gridRows = this.data.rows;

        const rows: Row[] = gridRows.map((values): Row => {
            const data: { [key: string]: unknown } = {};
            const nRows = Math.min(gridColumns.length, values.length);
            
            for (let i = 0; i < nRows; i++) {
                data[gridColumns[i]] = expressions.autoConvert(values[i]);
            }

            return data;
        });

        for (const sub of this.subs) {
            sub(rows);
        }
    }
}


export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Data-Grid',
    menuGroup: 'Input',
    description: 'Input table of values.',
    fields: {
        data: {
            label: 'Data',
            type: InputType.DATA_GRID,
            initialValue: emptyDataGrid()
        }
    },
    ports: {
        in: {},
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    createProcessor(node) {
        const data = node.fields.data as DataGridInputValue;  
        return new DataGridProcessor(data);
    },
    mapContext(node): ChartContext {
        const data = node.fields.data as DataGridInputValue;
        return {
            columns: data.columns
        };
    }
};
