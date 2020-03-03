import { Column, GraphNodeConfig, InputType, GraphNode, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ViewType, GridColumnConfig, GridValueConfig, Row } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";

function getDefaultViewName(node: GraphNode) {
    return 'grid-' + node.id;
}

const PORT_COLUMNS = 'columns';
const PORT_DATA = 'data';
const PORT_ON_CLICK = 'onClick';

class GridViewProcessor extends BaseNodeProcessor {
    private data: Row[] | undefined;
    private columns: GridColumnConfig[] | undefined;

    constructor(
        private readonly viewName: string,
        private readonly params: ChartParams
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_DATA) {
            this.data = values[0] as Row[];

        } else if (portName === PORT_COLUMNS) {
            this.columns = values as GridColumnConfig[];
        }

        if (!this.data || !this.columns) {
            return;
        }

        const columnConfigs = new Array<GridColumnConfig>();

        // resolve columns
        const mappedKeys = new Set<string>();
        for (const column of this.columns) {
            if (!column.restTemplate) {
                columnConfigs.push(column);
                mappedKeys.add(column.key);
            }
        }

        // resolve rest template columns
        for (const column of this.columns) {
            if (column.restTemplate) {
                const datum = this.data[0];
                if (!datum) continue;

                for (const key in datum) {
                    if (!mappedKeys.has(key)) {
                        const name = key;
                        columnConfigs.push({ ...column, key, name });
                    }
                }
            }
        }

        // sort columns by order
        columnConfigs.sort((a, b) => a.order - b.order);

        // map columns config to grid columns
        const gridColumns: Column[] = columnConfigs.map<Column>(column => ({
            name: column.name,
            editable: true,
            width: column.width,
            maxWidth: 400
        }));

        // map rows to grid values
        const gridData: GridValueConfig[][] = this.data.map((row, index) => {
            return columnConfigs.map<GridValueConfig>(column => ({
                value: asString(row[column.key]),
                ...column.mapRow(row, index, column.key)
            }));
        });

        this.params.actions.renderView?.(this.viewName, {
            type: ViewType.GRID,
            columns: gridColumns,
            data: gridData,
        });
    }
}

export const GRID_VIEW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid View',
    menuGroup: 'Grid',
    description: 'Displays the data as a grid view.',
    ports: {
        in: {
            [PORT_DATA]: {
                type: 'row[]'
            },
            [PORT_COLUMNS]: {
                type: 'column',
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
            viewName = getDefaultViewName(node);
        }

        return new GridViewProcessor(viewName, params);
    }
}
