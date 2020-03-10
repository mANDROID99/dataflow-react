import { BaseNodeProcessor, GraphNodeConfig, InputType as CoreInputType } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { ColumnMapperInputValue, InputType } from "../../types/inputTypes";
import { Row } from "../../types/valueTypes";
import { compileColumnMapper } from "../../utils/columnMapperUtils";
import { Mapper, rowToEvalContext } from "../../utils/expressionUtils";

const PORT_ROWS = 'rows';

type Config = {
    descending: boolean;
    mapColumnKey: Mapper;
}

class SortByNodeProcessor extends BaseNodeProcessor {
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

        const rows = values[0] as Row[];
        const rowsSorted = rows.slice(0);

        rowsSorted.sort((a, b) => {
            const sortKeyA = this.config.mapColumnKey(rowToEvalContext(a, null, null, this.params.variables)) as any;
            const sortKeyB = this.config.mapColumnKey(rowToEvalContext(b, null, null, this.params.variables)) as any;
          
            if (sortKeyB > sortKeyA) {
                return this.config.descending ? 1 : -1;

            } else if (sortKeyB < sortKeyA) {
                return this.config.descending ? -1 : 1;

            } else {
                return 0;
            }
        });

        this.emitResult(PORT_ROWS, rowsSorted);
    }
}

export const SORT_BY_NODE: GraphNodeConfig<ChartContext, ChartParams> = {
    title: 'Sort By',
    menuGroup: 'Transform',
    description: 'Sorts the rows by a key.',
    ports: {
        in: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        },
        out: {
            [PORT_ROWS]: {
                type: 'row[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Map Column Key',
            type: InputType.COLUMN_MAPPER,
            initialValue: '',
            params: ({ context }) => ({
                columns: context?.columns
            })
        },
        desc: {
            label: 'Descending',
            type: CoreInputType.CHECK,
            initialValue: false
        }
    },
    createProcessor(node, params) {
        const descending = node.fields.desc as boolean;
        const mapColumnKeyExpr = node.fields.column as ColumnMapperInputValue;
        const mapColumnKey = compileColumnMapper(mapColumnKeyExpr);
        return new SortByNodeProcessor(params, { descending, mapColumnKey });
    }
}

