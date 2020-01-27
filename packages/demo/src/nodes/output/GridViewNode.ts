import { GraphNodeConfig, FieldInputType, GraphNode } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { ViewType, EMPTY_ROWS, Rows } from "../../types/valueTypes";

function getDefaultViewName(node: GraphNode) {
    return 'grid-' + node.id;
}

export const GRID_OUTPUT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid Output',
    menuGroup: 'Output',
    description: 'Displays the data as a grid.',
    ports: {
        in: {
            rows: {
                type: 'row[]'
            }
        },
        out: {
            onClick: {
                type: 'row'
            }
        }
    },
    fields: {
        name: {
            label: 'Name',
            initialValue: '',
            type: FieldInputType.TEXT
        }
    },
    createProcessor({ node, params }) {
        let gridName = node.fields.name as string;

        if (!gridName) {
            gridName = getDefaultViewName(node);
        }

        return {
            onNext(inputs) {
                const r = (inputs.rows[0] || EMPTY_ROWS) as Rows;

                if (params.renderView) {
                    params.renderView(gridName, {
                        viewType: ViewType.GRID,
                        rows: r.rows
                    });
                }
            }
        };
    }
}
