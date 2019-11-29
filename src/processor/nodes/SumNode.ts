import { RowGroup, Scalar, createScalar } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";
import { NodeProcessor } from "../NodeProcessor";

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
            const data = input.in as RowGroup[];
            const result: Scalar[] = [];  

            for (const item of data) {
                let amt: number = 0;
                for (const row of item.rows) {
                    amt += asNumber(row.data[column]);
                }
                result.push(createScalar(item.correlationId, item.parent, amt));
            }
    
            next('out', result); 
        }
    }
}
