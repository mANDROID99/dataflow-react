import { RowGroup, Scalar, createScalarValue, NodeValue } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

function asNumber(input: string | undefined): number {
    if (input) {
        return +input;
    } else {
        return 0;
    }
}

export const SUM_NODE: GraphNodeConfig = {
    title: 'Sum',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                initialValue: [],
                match: 'rowgroup[]'
            }
        },
        out: {
            out: {
                type: 'scalar[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    process(config) {
        const column = config.column as string;
        return (input, next) => {
            const data = input.in as NodeValue<RowGroup>[];
            const result: NodeValue<Scalar>[] = [];  

            for (const item of data) {
                let amt = 0;
                for (const row of item.data.rows) {
                    amt += asNumber(row.data[column]);
                }
                result.push(createScalarValue(item.correlationId, item.parent, amt));
            }
    
            next('out', result); 
        };
    }
};
