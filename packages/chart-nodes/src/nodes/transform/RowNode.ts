import { GraphNodeConfig, InputType, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";

const PORT_IN_VALUES = 'values';
const PORT_OUT_ROWS = 'rows';

const FIELD_ALIAS = 'alias';

type Config = {
    alias: string;
}

class PickProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName === PORT_IN_VALUES) {
            const vs: unknown[] = values[0] as unknown[];
            const rows: Row[] = vs.map(this.mapValue.bind(this));
            this.emitResult(PORT_OUT_ROWS, rows);
        }
    }

    private mapValue(value: unknown, i: number): Row {
        const alias = this.config.alias;
        return { [alias]: value };
    }
}

export const ROW_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Value to Row',
    menuGroup: 'Transform',
    description: 'Converts a value to a row.',
    ports: {
        in: {
            [PORT_IN_VALUES]: {
                type: 'value[]'
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
            initialValue: ''
        }
    },
    createProcessor(node, params) {
        const alias = node.fields[FIELD_ALIAS] as string;
        return new PickProcessor(params, { alias });
    },
    mapContext({ node }) {
        const alias = node.fields[FIELD_ALIAS] as string;
        const columns = [alias];
        return { columns };
    }
}
