import { BaseNodeProcessor, GraphNodeConfig, InputType as CoreInputType } from "@react-ngraph/core";
import chroma from 'chroma-js';
import { PARAM_SCALE } from '../../inputs/GradientPreviewFieldInput';
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { InputType } from '../../types/inputTypes';

const PORT_OUT_COLOR_SCHEME = 'color-scheme';

export const FIELD_SCALE_NAME = 'scale';
export const FIELD_SCALE_BREAKPOINTS = 'breakpoints';
const FIELD_GRADIENT_PREVIEW = 'gradient';

type BreakPoint = {
    color: string;
    pos: number;
}

export type GradientParams = {
    scaleName: string;
    scaleBreakPoints: BreakPoint[];
}

export type ColorScheme = {
    getColorAt(i: number, n: number): string;
}

function createScale(params: GradientParams) {
    if (params.scaleName) {
        return chroma.scale(params.scaleName);

    } else {
        const breakPoints = params.scaleBreakPoints;
        const colors: string[] = breakPoints.map(pt => pt.color);
        const points: number[] = breakPoints.map(pt => pt.pos);
        return chroma.scale(colors).domain(points);
    }
}

class ColorSchemeNodeProcessor extends BaseNodeProcessor {
    constructor(private readonly config: GradientParams) {
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
        const scale = createScale(this.config);
        return {
            getColorAt: (i, n) => {
                return scale(n > 1 ? i / (n - 1) : 0).hex();
            }
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
            type: CoreInputType.TEXT,
            initialValue: ''
        },
        [FIELD_SCALE_BREAKPOINTS]: {
            label: 'Scale Breakpoints',
            description: 'Break-points of the scale gradient',
            type: CoreInputType.MULTI,
            initialValue: [
                { color: '#00496b', pos: 0 },
                { color: '#BC5090', pos: 0.5 },
                { color: '#ffae00', pos: 1 }
            ],
            subFields: {
                color: {
                    label: 'Color',
                    type: CoreInputType.COLOR,
                    initialValue: '#ffffff'
                },
                pos: {
                    label: 'Pos',
                    type: CoreInputType.NUMBER,
                    initialValue: 0,
                    lockOrder: true,
                    style: {
                        maxWidth: '5rem'
                    },
                    params: {
                        min: 0,
                        max: 1
                    }
                }
            }
        },
        [FIELD_GRADIENT_PREVIEW]: {
            label: 'Preview',
            type: InputType.GRADIENT_PREVIEW,
            initialValue: null,
            renderWhenAnyFieldChanged: true,
            params: ({ fields }) => ({
                [PARAM_SCALE]: createScale({
                    scaleName: fields[FIELD_SCALE_NAME] as string,
                    scaleBreakPoints: fields[FIELD_SCALE_BREAKPOINTS] as BreakPoint[]
                })
            })
        }
    },
    createProcessor(node) {
        const scaleName = node.fields[FIELD_SCALE_NAME] as string;
        const scaleBreakPoints = node.fields[FIELD_SCALE_BREAKPOINTS] as BreakPoint[];
        return new ColorSchemeNodeProcessor({ scaleName, scaleBreakPoints });
    }
}
