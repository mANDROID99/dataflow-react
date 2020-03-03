import { GraphNodeConfig, InputType, columnExpression, ColumnMapperInputValue, expressions, BaseNodeProcessor } from "@react-ngraph/core";
import { ChartContext, ChartParams } from "../../types/contextTypes";
import { Row } from "../../types/valueTypes";
import { rowToEvalContext } from "../../utils/expressionUtils";
import { COMPUTE_CONTEXT_MERGE_INPUTS } from "../../chartContext";

const PORT_ROWS = 'rows';

type Config = {
    descending: boolean;
    mapColumnKey: expressions.Mapper;
}

class SortByNodeProcessor extends BaseNodeProcessor {
    private readonly subs: ((value: unknown) => void)[] = [];

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

        for (const sub of this.subs) {
            sub(rowsSorted);
        };  
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
            initialValue: columnExpression(''),
            params: {
                target: 'row'
            },
            resolveParams: ({ context }) => ({
                columns: context?.columns
            })
        },
        desc: {
            label: 'Descending',
            type: InputType.CHECK,
            initialValue: false
        }
    },
    computeContext: COMPUTE_CONTEXT_MERGE_INPUTS,
    createProcessor(node, params) {
        const descending = node.fields.desc as boolean;
        const mapColumnKeyExpr = node.fields.column as ColumnMapperInputValue;
        const mapColumnKey = expressions.compileColumnMapper(mapColumnKeyExpr, 'row');
        return new SortByNodeProcessor(params, { descending, mapColumnKey });
    }
}

