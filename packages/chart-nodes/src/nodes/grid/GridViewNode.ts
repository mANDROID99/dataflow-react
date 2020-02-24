import { Column, GraphNodeConfig, InputType, GraphNode, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ViewType, GridColumnConfig, GridValueConfig } from "../../types/valueTypes";

function getDefaultViewName(node: GraphNode) {
    return 'grid-' + node.id;
}

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
        if (portName !== PORT_COLUMNS) {
            return;
        }

        const columnConfigs = values as GridColumnConfig[];
        const columns: Column[] = columnConfigs.map<Column>(column => ({
            name: column.name,
            editable: true,
            width: column.width,
            maxWidth: 400
        }));

        const n = columnConfigs[0].values.length;
        const data: GridValueConfig[][] = new Array(n);

        for (let i = 0; i < n; i++) {
            const datum = columnConfigs.map(column => column.values[i]);
            data[i] = datum;
        }

        this.params.actions.renderView?.(this.viewName, {
            type: ViewType.GRID,
            columns,
            data,
        });
    }
}

export const GRID_VIEW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid View',
    menuGroup: 'Grid',
    description: 'Displays the data as a grid view.',
    ports: {
        in: {
            [PORT_COLUMNS]: {
                type: 'column',
                multi: true
            }
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
