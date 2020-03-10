import { BaseNodeProcessor, Column, GraphNodeConfig, InputType } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { GridColumnConfig, GridConfig, GridValueConfig } from "../../types/gridValueTypes";
import { ViewType } from "../../types/valueTypes";

const PORT_COLUMNS = 'columns';
const PORT_ON_CLICK = 'onClick';

class GridViewProcessor extends BaseNodeProcessor {
    constructor(
        private readonly viewName: string,
        private readonly params: ChartParams
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_COLUMNS) {
            const inputColumns = values as (GridColumnConfig | GridColumnConfig[])[];

            // convert columns to a flat array
            const columnConfigs = inputColumns.flatMap(x => x);

            // sort columns by order
            columnConfigs.sort((a, b) => a.order - b.order);

            // map columns config to grid columns
            const columns: Column[] = columnConfigs.map<Column>(column => ({
                name: column.name,
                editable: true,
                width: column.width,
                maxWidth: 400
            }));

            // map rows to grid data
            const nCols = columnConfigs.length;
            const data: GridValueConfig[][] = [];

            for (let i = 0;;i++) {
                const row: GridValueConfig[] = new Array(nCols);

                let j = 0;
                for (; j < nCols; j++) {
                    const values = columnConfigs[j].values;
                    if (i >= values.length) {
                        break;
                    }

                    row[j] = values[i];
                }

                if (j < nCols) {
                    break;
                }

                data.push(row);
            }

            const config: GridConfig = {
                type: ViewType.GRID,
                columns: columns,
                data
            };

            this.params.actions.renderView?.(this.viewName, config);
        }

        
    }
}

export const GRID_VIEW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid',
    menuGroup: 'Grid',
    description: 'Displays the data as a grid view.',
    ports: {
        in: {
            [PORT_COLUMNS]: {
                type: ['column', 'column[]'],
                multi: true
            },
        },
        out: {
            [PORT_ON_CLICK]: {
                type: 'row'
            }
        }
    },
    fields: {
        name: {
            label: 'Name',
            initialValue: '',
            type: InputType.TEXT
        }
    },
    createProcessor(node, params) {
        let viewName = node.fields.name as string;

        if (!viewName) {
            viewName = 'grid-' + node.id;
        }

        return new GridViewProcessor(viewName, params);
    }
}
