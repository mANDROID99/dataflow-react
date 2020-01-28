import { GraphNodeConfig, FieldInputType, GraphNode, NodeProcessor } from "@react-ngraph/core";
import { Column } from "@react-ngraph/common-util";

import { ChartContext, ChartParams } from "../../chartContext";
import { ViewType, RowsValue, ViewConfig } from "../../types/valueTypes";
import { NodeType } from "../nodes";

function getDefaultViewName(node: GraphNode) {
    return 'grid-' + node.id;
}

const PORT_ROWS = 'rows';
const PORT_ON_CLICK = 'onClick';

class GridViewProcessor implements NodeProcessor {
    private onClickSub?: (value: unknown) => void;

    constructor(
        private readonly viewName: string,
        private readonly renderView: ((viewName: string, viewConfig: ViewConfig) => void) | undefined
    ) { }

    get type(): string {
        return NodeType.GRID_VIEW;
    }

    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ON_CLICK) {
            this.onClickSub = sub;
        }
    }

    private onNext(value: unknown) {
        const r = value as RowsValue;

        const columns: Column[] = [];
        const rows: unknown[][] = [];
        const colIndices = new Map<string, number>();

        for (const row of r.rows) {
            const rowValues: unknown[] = [];

            for (const key in row) {
                let i = colIndices.get(key);
                if (i == null) {
                    colIndices.set(key, i = columns.length);
                    columns.push({
                        name: key,
                        width: 100,
                        minWidth: 30,
                        maxWidth: 400
                    });
                }

                rowValues[i] = row[key];
            }
            
            rows.push(rowValues);
        }

        if (this.renderView) {
            this.renderView(this.viewName, {
                type: ViewType.GRID,
                rows,
                columns
            });
        }
    }
}

export const GRID_VIEW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid View',
    menuGroup: 'Output',
    description: 'Displays the data as a grid view.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
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
            type: FieldInputType.TEXT
        }
    },
    createProcessor(node, params) {
        let viewName = node.fields.name as string;

        if (!viewName) {
            viewName = getDefaultViewName(node);
        }

        return new GridViewProcessor(viewName, params.renderView);
    }
}
