import { BaseNodeProcessor, GraphNodeConfig, InputType as CoreInputType } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { GridColumnConfig, GridValueConfig } from "../../types/gridValueTypes";
import { ColumnMapperInputValue, InputType } from "../../types/inputTypes";
import { Row } from "../../types/valueTypes";
import { compileColumnMapper } from "../../utils/columnMapperUtils";
import { asString } from "../../utils/conversions";
import { Mapper, rowToEvalContext } from "../../utils/expressionUtils";

const PORT_IN_DATA = 'data';
const PORT_OUT_COLUMNS = 'columns';

const FIELD_WIDTH = 'width';
const FIELD_ORDER = 'order';
const FIELD_MAP_VALUE = 'value';
const FIELD_MAP_FONT_COLOR = 'fontColor';
const FIELD_MAP_BG_COLOR = 'bgColor';

type Config = {
    width: number;
    order: number;
    mapValue: Mapper;
    mapFontColor: Mapper;
    mapBgColor: Mapper;
}


class GridAutoColumnProcessor extends BaseNodeProcessor {
    constructor(
        private readonly config: Config,
        private readonly context: { [key: string]: unknown }
    ) {
        super();
    }

    process(portName: string, data: unknown[][]): void {
        if (portName === PORT_IN_DATA) {
            const rows = data[0] as Row[];

            const columns: GridColumnConfig[] = [];
            const columnByKey = new Map<string, number>();

            for (let i = 0, n = rows.length; i < n; i++) {
                const row = rows[i];

                for (const key in row) {
                    let j = columnByKey.get(key);

                    if (j == null) {
                        j = columns.length;
                        columnByKey.set(key, j);

                        columns.push({
                            name: key,
                            width: this.config.width,
                            order: this.config.order,
                            values: new Array<GridValueConfig>(n)
                        });
                    }

                    columns[j].values[i] = this.mapRow(row, key, i);
                }
            }

            this.emitResult(PORT_OUT_COLUMNS, columns);
        }
    }

    private mapRow(row: Row, columnKey: string, rowIndex: number): GridValueConfig {
        const ctx = rowToEvalContext(row, rowIndex, columnKey, this.context);
        let value = asString(row[columnKey]);

        const v = this.config.mapValue(ctx);
        if (v != null) value = asString(value);

        const result: GridValueConfig = { value };

        const fontColor = asString(this.config.mapFontColor(ctx));
        if (fontColor) result.fontColor = fontColor;

        const bgColor = asString(this.config.mapBgColor(ctx), undefined);
        if (bgColor) result.bgColor = bgColor;

        return result;
    }
}

export const GRID_AUTO_COLUMN_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Grid Auto Columns',
    menuGroup: 'Grid',
    description: 'Automatically generate columns for each key in the data',
    ports: {
        in: {
            [PORT_IN_DATA]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_OUT_COLUMNS]: {
                type: 'column[]'
            }
        }
    },
    fields: {
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
        }
    },
    createProcessor(node, params) {
        const fields = node.fields;
        const width = fields[FIELD_WIDTH] as number;
        const order = fields[FIELD_ORDER] as number;
        const mapValue = compileColumnMapper(fields[FIELD_MAP_VALUE] as ColumnMapperInputValue);
        const mapFontColor = compileColumnMapper(fields[FIELD_MAP_FONT_COLOR] as ColumnMapperInputValue);
        const mapBgColor = compileColumnMapper(fields[FIELD_MAP_BG_COLOR] as ColumnMapperInputValue);
        return new GridAutoColumnProcessor({
            width,
            order,
            mapValue,
            mapFontColor,
            mapBgColor
        }, params.variables);
    }
}

