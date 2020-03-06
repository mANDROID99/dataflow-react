import chroma from 'chroma-js';
import { GraphNodeConfig, InputType, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";

const PORT_OUT_COLOR_SCHEME = 'color-scheme';

const FIELD_SCALE_NAME = 'scale';
const FIELD_SCALE_BREAKPOINTS = 'breakpoints'

type BreakPoint = {
    color: string;
    pos: number;
}

type Config = {
    scaleName: string;
    scaleBreakPoints: BreakPoint[];
}

export type ColorScheme = {
    getColorAt(i: number, n: number): string;
}

class ColorSchemeNodeProcessor extends BaseNodeProcessor {
    constructor(private readonly config: Config) {
        super();
    }

    process(): void {
        /* do nothing */
    }

    start() {
        const colorScheme = this.createColorScheme();
        this.emitResult(PORT_OUT_COLOR_SCHEME, colorScheme);
    }

    private createColorScheme(): ColorScheme {
        const scale = this.createScaleFromConfig();
        return {
            getColorAt: (i, n) => {
                return scale(n > 1 ? i / (n - 1) : 0).hex();
            }
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
        in: {},
        out: {
            [PORT_OUT_COLOR_SCHEME]: {
                type: 'color-scheme'
            }
        }
    },
    fields: {
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
    createProcessor(node) {
        const scaleName = node.fields[FIELD_SCALE_NAME] as string;
        const scaleBreakPoints = node.fields[FIELD_SCALE_BREAKPOINTS] as BreakPoint[];
        return new ColorSchemeNodeProcessor({ scaleName, scaleBreakPoints });
    }
}
