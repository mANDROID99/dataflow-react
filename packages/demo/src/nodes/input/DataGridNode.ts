import { GraphNodeConfig, FieldInputType, DataGridInputValue, NodeProcessor } from "@react-ngraph/core";
import { NodeType } from '../nodes';
import { ChartContext } from "../../chartContext";
import { Row } from "../../types/valueTypes";

const PORT_ROWS = 'rows';

type Fields = {
    data: DataGridInputValue;
};

class DataGridProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly fields: Fields
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

    onStart(): void {
        if (!this.subs.length) return;
        
        const data = this.fields.data;
        const gridColumns = data.columns;
        const gridRows = data.rows;

        const rows: Row[] = gridRows.map((values): Row => {
            const data: { [key: string]: string } = {};
            const nRows = Math.min(gridColumns.length, values.length);
            
            for (let i = 0; i < nRows; i++) {
                data[gridColumns[i]] = values[i];
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
            type: FieldInputType.DATA_GRID
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
    createProcessor(fields) {
        return new DataGridProcessor(fields as Fields);
    },
    mapContext(fields): ChartContext {
        const data = fields.data as DataGridInputValue;
        return {
            columns: data.columns
        };
    }
};
