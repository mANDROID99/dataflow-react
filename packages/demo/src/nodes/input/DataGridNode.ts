import { GraphNodeConfig, FieldInputType, emptyDataGrid, DataGridInputValue, NodeProcessor } from "@react-ngraph/core";
import { NodeType } from '../nodes';
import { ChartContext } from "../../chartContext";
import { Row, createRowsValue } from "../../types/valueTypes";

const PORT_ROWS = 'rows';

class DataGridProcessor implements NodeProcessor {
    private sub?: (value: unknown) => void;

    constructor(
        private readonly data: DataGridInputValue
    ) { }

    get type(): string {
        return NodeType.DATA_GRID
    }
    
    registerProcessor(): void { }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ROWS) {
            this.sub = sub;
        }
    }

    onStart(): void {
        if (!this.sub) return;
        
        const columnNames = this.data.columns;
        const rowValues = this.data.rows;

        const rows: Row[] = rowValues.map((values): Row => {
            const data: { [key: string]: string } = {};
            const nRows = Math.min(columnNames.length, values.length);
            
            for (let i = 0; i < nRows; i++) {
                data[columnNames[i]] = values[i];
            }

            return data;
        });

        this.sub(createRowsValue(rows));
    }
}


export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Data-Grid',
    menuGroup: 'Input',
    description: 'Input table of values.',
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
