import { GraphNodeConfig, InputType, emptyDataGrid, expressions, DataGridInputValue, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";

const PORT_ROWS = 'rows';
const FIELD_DATA = 'data';

class DataGridProcessor extends BaseNodeProcessor {
    
    constructor(
        private readonly data: DataGridInputValue
    ) {
        super();
    }

    process(): void {
        /* do nothing */
    }

    start(): void {
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

        this.emitResult(PORT_ROWS, rows);
    }
}


export const DATA_GRID_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Data-Grid',
    menuGroup: 'Input',
    description: 'Input table of values.',
    fields: {
        [FIELD_DATA]: {
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
        const data = node.fields[FIELD_DATA] as DataGridInputValue;  
        return new DataGridProcessor(data);
    },
    computeContext: {
        compute(columns: string[]) {
            return { columns };    
        },
        deps: ({ node }) => [(node.fields[FIELD_DATA] as DataGridInputValue).columns]
    }
};
