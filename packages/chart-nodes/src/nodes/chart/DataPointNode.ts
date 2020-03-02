import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, Row } from "../../types/valueTypes";
import { asValue, asNumber, asString } from "../../utils/conversions";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { COMPUTE_CONTEXT_MERGE_INPUTS } from "../../chartContext";

const PORT_ROWS = 'rows';
const PORT_POINTS = 'points';

type Config = {
    mapX: expressions.Mapper;
    mapY: expressions.Mapper;
    mapR: expressions.Mapper;
    mapColor: expressions.Mapper;
}

class DataPointNodeProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, inputs: unknown[]) {
        if (portName !== PORT_ROWS) {
            return;
        }

        const rows = inputs[0] as Row[];
        const points: ChartDataPoint[] = rows.map((row, i): ChartDataPoint => {
            const ctx = rowToEvalContext(row, i, this.params.variables);

            const x = asValue(this.config.mapX(ctx), 0);
            const y = asValue(this.config.mapY(ctx), 0);
            const r = asNumber(this.config.mapR(ctx));
            const color = asString(this.config.mapColor(ctx));
            return { x, y, r, color, row }
        });

        this.emitResult(PORT_POINTS, points);
    }
}

export const DATA_POINT_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Data-Points',
    menuGroup: 'Chart',
    description: 'Transforms rows to points for the dataset.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_POINTS]: {
                type: 'datapoint[]'
            }
        }
    },
    fields: {
        x: {
            label: 'Map X',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        y: {
            label: 'Map Y',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        r: {
            label: 'Map R',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        color: {
            label: 'Map Color',
            type: InputType.COLUMN_MAPPER,
            fieldGroup: 'Styling',
            initialValue: columnExpression(''),
            params: {
                optional: true,
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        }
    },
    computeContext: COMPUTE_CONTEXT_MERGE_INPUTS,
    createProcessor(node, params) {
        const mapXExpr = node.fields.x as ColumnMapperInputValue;
        const mapYExpr = node.fields.y as ColumnMapperInputValue;
        const mapRExpr = node.fields.r as ColumnMapperInputValue;
        const mapColorExpr = node.fields.color as ColumnMapperInputValue;

        const mapX = expressions.compileColumnMapper(mapXExpr, 'row');
        const mapY = expressions.compileColumnMapper(mapYExpr, 'row');
        const mapR = expressions.compileColumnMapper(mapRExpr, 'row');
        const mapColor = expressions.compileColumnMapper(mapColorExpr, 'row');

        return new DataPointNodeProcessor(params, { mapX, mapY, mapR, mapColor });
    }
};
