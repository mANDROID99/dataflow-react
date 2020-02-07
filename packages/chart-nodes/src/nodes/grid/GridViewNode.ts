import { Column, GraphNodeConfig, InputType, GraphNode, NodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../chartContext";
import { ViewType, ViewConfig, Row, GridColumnConfig, GridValueConfig } from "../../types/valueTypes";
import { NodeType } from "../nodes";

function getDefaultViewName(node: GraphNode) {
    return 'grid-' + node.id;
}

const PORT_COLUMNS = 'columns';
const PORT_ON_CLICK = 'onClick';

class GridViewProcessor implements NodeProcessor {
    private readonly onClickSubs: ((value: unknown) => void)[] = [];
    private readonly columns: GridColumnConfig[] = [];

    constructor(
        private readonly viewName: string,
        private readonly renderView: ((viewName: string, viewConfig: ViewConfig) => void) | undefined
    ) { }

    get type(): string {
        return NodeType.GRID_VIEW;
    }

    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_COLUMNS) {
            const i = this.columns.length++;
            processor.subscribe(portOut, this.onNext.bind(this, i));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_ON_CLICK) {
            this.onClickSubs.push(sub);
        }
    }

    private isReady(): boolean {
        for (let i = 0, n = this.columns.length; i < n; i++) {
            if (!(i in this.columns)) return false;
        }
        return true;
    }

    private onNext(index: number, value: unknown) {
        const column = value as GridColumnConfig;
        this.columns[index] = column;
        if (!this.isReady() || !this.columns.length) return;

        const columns: Column[] = this.columns.map<Column>(column => ({
            name: column.name,
            editable: true,
            width: column.width,
            maxWidth: 400
        }));

        const n = this.columns[0].values.length;
        const data: GridValueConfig[][] = new Array(n);

        for (let i = 0; i < n; i++) {
            const datum = this.columns.map(column => column.values[i]);
            data[i] = datum;
        }

        if (this.renderView) {
            this.renderView(this.viewName, {
                type: ViewType.GRID,
                columns,
                data,
            });
        }
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

        return new GridViewProcessor(viewName, params.renderView);
    }
}
