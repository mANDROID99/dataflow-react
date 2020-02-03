import { GraphNodeConfig, expressions, FieldInputType, NodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../chartContext";
import { Row, GridValueConfig, GridColumnConfig } from "../../types/valueTypes";
import { asString } from "../../utils/converters";
import { NodeType } from "../nodes";

const PORT_ROWS = 'rows';
const PORT_COLUMN = 'values';

type Fields = {
    name: string;
    width: number;
    value: expressions.Mapper;
    fontColor: expressions.Mapper;
    bgColor: expressions.Mapper;
}

class GridColumnProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly fields: Fields,
        private readonly context: { [key: string]: unknown }
    ) { }

    get type(): string {
        return NodeType.GRID_COLUMN;
    }

    registerProcessor(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_COLUMN) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        const rows = value as Row[];
        const values = rows.map<GridValueConfig>((row) => {
            const ctx = { ...this.context, row };

            const value = asString(this.fields.value(ctx));
            const fontColor = asString(this.fields.fontColor(ctx), undefined);
            const bgColor = asString(this.fields.bgColor(ctx), undefined);

            return {
                value,
                fontColor,
                bgColor
            };
        });

        const column: GridColumnConfig = {
            name: this.fields.name,
            width: this.fields.width,
            values
        }
        
        for (const sub of this.subs) {
            sub(column);
        }
    }
}

export const GRID_COLUMN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid Column',
    menuGroup: 'Grid',
    description: 'Maps rows to formatted values to show on the grid.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_COLUMN]: {
                type: 'column'
            }
        }
    },
    fields: {
        name: {
            label: 'Name',
            type: FieldInputType.TEXT
        },
        width: {
            label: 'Width',
            type: FieldInputType.NUMBER,
            initialValue: 100,
            params: { min: 0 }
        },
        value: {
            label: 'Map Value',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                columns: context.columns,
                target: 'row'
            })
        },
        fontColor: {
            label: 'Map Font Color',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        },
        bgColor: {
            label: 'Map Background Color',
            type: FieldInputType.COLUMN_MAPPER,
            params: ({ context }) => ({
                optional: true,
                columns: context.columns,
                target: 'row'
            })
        }
    },
    createProcessor(fields, { params }) {
        return new GridColumnProcessor(fields as Fields, params.variables);
    }
}
