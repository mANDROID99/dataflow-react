import { GraphNodeConfig, InputType as CoreInputType, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";
import { InputType, ColumnMapperInputValue } from "../../types/inputTypes";
import { GridColumnConfig, GridValueConfig } from "../../types/gridValueTypes";

import { asString } from "../../utils/conversions";
import { rowToEvalContext, Mapper } from "../../utils/expressionUtils";
import { compileColumnMapper } from "../../utils/columnMapperUtils";

const PORT_DATA = 'data';
const PORT_COLUMN = 'column';

const FIELD_NAME = 'name';
const FIELD_WIDTH = 'width';
const FIELD_KEY = 'key';
const FIELD_ORDER = 'order';
const FIELD_MAP_VALUE = 'value';
const FIELD_MAP_FONT_COLOR = 'fontColor';
const FIELD_MAP_BG_COLOR = 'bgColor';
const FIELD_REST_TEMPLATE = 'template';

type Config = {
    name: string;
    width: number;
    order: number;
    key: string;
    restTemplate: boolean;
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
    
    start() {
        const column: GridColumnConfig = {
            key: this.config.key,
            name: this.config.name,
            width: this.config.width,
            order: this.config.order,
            restTemplate: this.config.restTemplate,
            mapRow: this.mapStyle.bind(this)
        };
        this.emitResult(PORT_COLUMN, column);
    }

    process(): void {
        /* do nothing */
    }

    private mapStyle(row: Row, rowIndex: number, columnKey: string): Partial<GridValueConfig> {
        const ctx = rowToEvalContext(row, rowIndex, columnKey, this.context);
        const result: Partial<GridValueConfig> = {};

        const fontColor = asString(this.config.mapFontColor(ctx));
        if (fontColor) result.fontColor = fontColor;

        const bgColor = asString(this.config.mapBgColor(ctx), undefined);
        if (bgColor) result.bgColor = bgColor;

        const value = asString(this.config.mapValue(ctx));
        if (value) result.value = value;

        return result;
    }
}

export const GRID_COLUMN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid Column',
    menuGroup: 'Grid',
    description: 'Column to show in the grid.',
    ports: {
        in: {
            [PORT_DATA]: {
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
            type: CoreInputType.TEXT,
            initialValue: '',
            label: 'Column Name'
        },
        [FIELD_KEY]: {
            type: CoreInputType.SELECT,
            initialValue: '',
            label: 'Row Key',
            params: ({ context }) => ({
                options: context.columns
            })
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
                optional: true,
                columns: context?.columns
            })
        },
        [FIELD_MAP_FONT_COLOR]: {
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            label: 'Map Font Color',
            fieldGroup: 'Styling',
            params: ({ context }) => ({
                optional: true,
                columns: context?.columns
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
        },
        [FIELD_REST_TEMPLATE]: {
            label: 'Rest Template',
            type: CoreInputType.CHECK,
            initialValue: false,
            fieldGroup: 'More'
        }
    },
    createProcessor(node, params) {
        const fields = node.fields;
        const name = fields[FIELD_NAME] as string;
        const key = fields[FIELD_KEY] as string;
        const width = fields[FIELD_WIDTH] as number;
        const order = fields[FIELD_ORDER] as number;
        const restTemplate = fields[FIELD_REST_TEMPLATE] as boolean;
        const mapValue = compileColumnMapper(fields[FIELD_MAP_VALUE] as ColumnMapperInputValue);
        const mapFontColor = compileColumnMapper(fields[FIELD_MAP_FONT_COLOR] as ColumnMapperInputValue);
        const mapBgColor = compileColumnMapper(fields[FIELD_MAP_BG_COLOR] as ColumnMapperInputValue);
        return new GridColumnNodeProcessor({ name, key, width, order, restTemplate, mapValue, mapFontColor, mapBgColor }, params.variables);
    }
}

