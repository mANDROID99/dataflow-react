import { BaseNodeProcessor, GraphNodeConfig, InputType as CoreInputType } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { GridColumnConfig, GridValueConfig } from "../../types/gridValueTypes";
import { ColumnMapperInputValue, InputType } from "../../types/inputTypes";
import { Row } from "../../types/valueTypes";
import { compileColumnMapper } from "../../utils/columnMapperUtils";
import { asString } from "../../utils/conversions";
import { Mapper, rowToEvalContext } from "../../utils/expressionUtils";

const PORT_IN_DATA = 'data';
const PORT_OUT_COLUMN = 'column';

const FIELD_NAME = 'name';
const FIELD_WIDTH = 'width';
const FIELD_ORDER = 'order';
const FIELD_MAP_VALUE = 'value';
const FIELD_MAP_FONT_COLOR = 'fontColor';
const FIELD_MAP_BG_COLOR = 'bgColor';

type Config = {
    name: string;
    width: number;
    order: number;
    mapValue: Mapper;
    mapFontColor: Mapper;
    mapBgColor: Mapper;
};

class GridColumnNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly config: Config,
        private readonly context: { [key: string]: unknown }
    ) {
        super();
    }
    
    process(portName: string, data: unknown[][]): void {
        if (portName === PORT_IN_DATA) {
            const rows = data[0] as Row[];
            const values = rows.map(this.mapRow.bind(this));
            const column: GridColumnConfig = {
                name: this.config.name,
                width: this.config.width,
                order: this.config.order,
                values
            };
            this.emitResult(PORT_OUT_COLUMN, column);
        }
    }

    private mapRow(row: Row, rowIndex: number): GridValueConfig {
        const ctx = rowToEvalContext(row, rowIndex, null, this.context);
        const result: GridValueConfig = {
            value: asString(this.config.mapValue(ctx))
        };

        const fontColor = asString(this.config.mapFontColor(ctx));
        if (fontColor) result.fontColor = fontColor;

        const bgColor = asString(this.config.mapBgColor(ctx), undefined);
        if (bgColor) result.bgColor = bgColor;

        return result;
    }
}

export const GRID_COLUMN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid Column',
    menuGroup: 'Grid',
    description: 'Column to show in the grid.',
    ports: {
        in: {
            [PORT_IN_DATA]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_OUT_COLUMN]: {
                type: 'column'
            }
        }
    },
    fields: {
        [FIELD_NAME]: {
            type: CoreInputType.TEXT,
            initialValue: '',
            label: 'Column Name'
        },
        [FIELD_WIDTH]: {
            type: CoreInputType.NUMBER,
            initialValue: 100,
            label: 'Column Width'
        },
        [FIELD_ORDER]: {
            type: CoreInputType.NUMBER,
            initialValue: 0,
            label: 'Column Order'
        },
        [FIELD_MAP_VALUE]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            label: 'Map Value',
            fieldGroup: 'Styling',
            params: ({ context }) => ({
                columns: context.columns
            })
        },
        [FIELD_MAP_FONT_COLOR]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            label: 'Map Font Color',
            fieldGroup: 'Styling',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        },
        [FIELD_MAP_BG_COLOR]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            label: 'Map Background Color',
            fieldGroup: 'Styling',
            params: ({ context }) => ({
                optional: true,
                columns: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const fields = node.fields;
        const name = fields[FIELD_NAME] as string;
        const width = fields[FIELD_WIDTH] as number;
        const order = fields[FIELD_ORDER] as number;
        const mapValue = compileColumnMapper(fields[FIELD_MAP_VALUE] as ColumnMapperInputValue);
        const mapFontColor = compileColumnMapper(fields[FIELD_MAP_FONT_COLOR] as ColumnMapperInputValue);
        const mapBgColor = compileColumnMapper(fields[FIELD_MAP_BG_COLOR] as ColumnMapperInputValue);
        return new GridColumnNodeProcessor({ name, width, order, mapValue, mapFontColor, mapBgColor }, params.variables);
    }
}

