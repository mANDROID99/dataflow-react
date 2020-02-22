import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, NodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ChartDataPoint, Row } from "../../types/valueTypes";
import { asValue, asNumber, asString } from "../../utils/conversions";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { NodeType } from "../nodes";

const PORT_ROWS = 'rows';
const PORT_POINTS = 'points';

type Config = {
    mapX: expressions.Mapper;
    mapY: expressions.Mapper;
    mapR: expressions.Mapper;
    mapColor: expressions.Mapper;
}

class DataPointNodeProcessor implements NodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) { }

    get type(): string {
        return NodeType.DATA_POINTS;
    }

    register(portIn: string, portOut: string, processor: NodeProcessor): void {
        if (portIn === PORT_ROWS) {
            processor.subscribe(portOut, this.onNext.bind(this));
        }
    }

    subscribe(portName: string, sub: (value: unknown) => void): void {
        if (portName === PORT_POINTS) {
            this.subs.push(sub);
        }
    }

    private onNext(value: unknown) {
        if (!this.subs.length) return;

        const rows = value as Row[];
        const points: ChartDataPoint[] = rows.map((row, i): ChartDataPoint => {
            const ctx = rowToEvalContext(row, i, this.params.variables);

            const x = asValue(this.config.mapX(ctx), 0);
            const y = asValue(this.config.mapY(ctx), 0);
            const r = asNumber(this.config.mapR(ctx));
            const color = asString(this.config.mapColor(ctx));
            return { x, y, r, color, row }
        });

        for (const sub of this.subs) {
            sub(points);
        }
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
            resolve: ({ context }) => ({
                columns: context.columns
            })
        },
        y: {
            label: 'Map Y',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
            params: {
                target: 'row'
            },
            resolve: ({ context }) => ({
                columns: context.columns
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
            resolve: ({ context }) => ({
                columns: context.columns
            })
        },
        color: {
            label: 'Map Color',
            type: InputType.COLUMN_MAPPER,
            initialValue: columnExpression(''),
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
