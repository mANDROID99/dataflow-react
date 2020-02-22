import { GraphNodeConfig, InputType, NodeProcessor, columnExpression, expressions, ColumnMapperInputValue } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row, GridValueConfig, GridColumnConfig } from "../../types/valueTypes";
import { asString } from "../../utils/conversions";
import { NodeType } from "../nodes";
import { rowToEvalContext } from "../../utils/expressionUtils";

const PORT_ROWS = 'rows';
const PORT_COLUMN = 'column';

const FIELD_NAME = 'name';
const FIELD_WIDTH = 'width';
const FIELD_VALUE = 'value';
const FIELD_FONT_COLOR = 'fontColor';
const FIELD_BG_COLOR = 'bgColor';

type Config = {
    name: string;
    width: number;
    mapValue: expressions.Mapper,
    mapFontColor: expressions.Mapper,
    mapBgColor: expressions.Mapper
};

class GridColumnNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly config: Config,
        private readonly context: { [key: string]: unknown }
    ) { }
    
    get type(): string {
        return NodeType.GRID_COLUMN;
    }

    register(portIn: string, portOut: string, processor: NodeProcessor): void {
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
        const values = rows.map<GridValueConfig>((row, i) => {
            const ctx = rowToEvalContext(row, i, this.context);
            const value = asString(this.config.mapValue(ctx));
            const fontColor = asString(this.config.mapFontColor(ctx), undefined);
            const bgColor = asString(this.config.mapBgColor(ctx), undefined);

            return {
                value,
                fontColor,
                bgColor
            };
        });

        const column: GridColumnConfig = {
            name: this.config.name,
            width: this.config.width,
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
    description: 'Column to show in the grid.',
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
        [FIELD_NAME]: {
            type: InputType.TEXT,
            initialValue: '',
            label: 'Column Name'
        },
        [FIELD_WIDTH]: {
            type: InputType.NUMBER,
            initialValue: 100,
            label: 'Column Width'
        },
        [FIELD_VALUE]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            label: 'Map Value',
            params: {
                target: 'row'
            },
            resolve: ({ context }) => ({
                columns: context.columns
            })
        },
        [FIELD_FONT_COLOR]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            label: 'Map Font Color',
            params: {
                optional: true,
                target: 'row'
            },
            resolve: ({ context }) => ({
                columns: context.columns
            })
        },
        [FIELD_BG_COLOR]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            label: 'Map Background Color',
            params: {
                optional: true,
                target: 'row'
            },
            resolve: ({ context }) => ({
                columns: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const fields = node.fields;
        const name = fields.name as string;
        const width = fields.width as number;
        const mapValue = expressions.compileColumnMapper(fields[FIELD_VALUE] as ColumnMapperInputValue, 'row');
        const mapFontColor = expressions.compileColumnMapper(fields[FIELD_FONT_COLOR] as ColumnMapperInputValue, 'row');
        const mapBgColor = expressions.compileColumnMapper(fields[FIELD_BG_COLOR] as ColumnMapperInputValue, 'row');
        return new GridColumnNodeProcessor({ name, width, mapValue, mapFontColor, mapBgColor }, params.variables);
    }
}

