import { GraphNodeConfig, InputType, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";

const PORT_ROWS = 'rows';
const PORT_VALUES = 'values';
const FIELD_KEY = 'key';

type Config = {
    key: string;
}

class PickProcessor extends BaseNodeProcessor {
    constructor(
        private readonly params: ChartParams,
        private readonly config: Config
    ) {
        super();
    }

    process(portName: string, values: unknown[]) {
        if (portName !== PORT_ROWS) {
            return;
        }

        const rows: Row[] = values[0] as Row[];
        const vs: unknown[] = rows.map(this.mapRow.bind(this));
        this.emitResult(PORT_VALUES, vs);
    }

    private mapRow(row: Row): unknown {
        return row[this.config.key];
    }
}

export const PICK_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Pick',
    menuGroup: 'Transform',
    description: 'Sorts the rows by a key.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_VALUES]: {
                type: 'value[]'
            }
        }
    },
    fields: {
        [FIELD_KEY]: {
            label: 'Row key',
            type: InputType.SELECT,
            initialValue: '',
            resolveParams: ({ context }) => ({
                options: context.columns
            })
        }
    },
    createProcessor(node, params) {
        const key = node.fields[FIELD_KEY] as string;
        return new PickProcessor(params, { key });
    },
    mapContext() {
        return { columns: [] };
    }
}
