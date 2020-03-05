import chroma from 'chroma-js';
import { GraphNodeConfig, InputType, BaseNodeProcessor } from "@react-ngraph/core";

import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from '../../types/valueTypes';
import { pushDistinct } from '../../utils/arrayUtils';

const PORT_IN_ROWS = 'rows';
const PORT_OUT_ROWS = 'rows';

const FIELD_ALIAS = 'alias';
const FIELD_SCALE_NAME = 'scale';
const FIELD_SCALE_BREAKPOINTS = 'breakpoints'

type BreakPoint = {
    color: string;
    pos: number;
}

type Config = {
    alias: string;
    scaleName: string;
    scaleBreakPoints: BreakPoint[];
}

class ColorSchemeNodeProcessor extends BaseNodeProcessor {
    constructor(private readonly config: Config) {
        super();
    }

    process(portName: string, values: unknown[]): void {
        if (portName === PORT_IN_ROWS) {
            let rows = values[0] as Row[];

            const alias = this.config.alias;
            const scale = this.createScaleFromConfig();

            rows = rows.map((row, index, rows) => {
                const n = rows.length;
                const color = scale(n > 1 ? index / (n - 1) : 0).hex();
                return { ...row, [alias]: color };
            });

            this.emitResult(PORT_OUT_ROWS, rows);
        }
    }

    private createScaleFromConfig(): chroma.Scale<chroma.Color> {
        const config = this.config;
        if (config.scaleName) {
            return chroma.scale(config.scaleName);

        } else {
            const breakPoints = config.scaleBreakPoints;
            const colors: string[] = breakPoints.map(pt => pt.color);
            const points: number[] = breakPoints.map(pt => pt.pos);
            return chroma.scale(colors).domain(points);
        }
    }
}

export const COLOR_SCHEME_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Color Scheme',
    description: 'Chroma.js color scheme generator',
    menuGroup: 'Styling',
    ports: {
        in: {
            [PORT_IN_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_OUT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        [FIELD_ALIAS]: {
            label: 'Alias',
            type: InputType.TEXT,
            initialValue: 'color'
        },
        [FIELD_SCALE_NAME]: {
            label: 'Scale Name',
            description: 'Chroma.js scale name',
            type: InputType.TEXT,
            initialValue: ''
        },
        [FIELD_SCALE_BREAKPOINTS]: {
            label: 'Scale Breakpoints',
            description: 'Break-points of the scale gradient',
            type: InputType.MULTI,
            initialValue: [
                { color: '#00496b', pos: 0 },
                { color: '#BC5090', pos: 0.5 },
                { color: '#ffae00', pos: 1 }
            ],
            subFields: {
                color: {
                    label: 'Color',
                    type: InputType.COLOR,
                    initialValue: '#ffffff'
                },
                pos: {
                    label: 'Pos',
                    type: InputType.NUMBER,
                    initialValue: 0,
                    style: {
                        maxWidth: '5rem'
                    },
                    params: {
                        min: 0,
                        max: 1
                    }
                }
            }
        }
    },
    mapContext({ node, context }) {
        let columns = context.columns;
        columns = pushDistinct(columns, node.fields[FIELD_ALIAS] as string);
        return { ...context, columns };
    },
    createProcessor(node) {
        const alias = node.fields[FIELD_ALIAS] as string;
        const scaleName = node.fields[FIELD_SCALE_NAME] as string;
        const scaleBreakPoints = node.fields[FIELD_SCALE_BREAKPOINTS] as BreakPoint[];
        return new ColorSchemeNodeProcessor({ alias, scaleName, scaleBreakPoints });
    }
}
