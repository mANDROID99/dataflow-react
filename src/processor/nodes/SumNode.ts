import { RowGroup, createRowGroup, Primitive } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

function asNumber(input: Primitive): number {
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
            data: {
                type: 'rowgroup[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.TEXT
        },
        alias: {
            label: 'Alias',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    process({ config }) {
        const column = config.column as string;
        const alias = config.alias as string;

        return (input, next) => {
            const data = input.in as RowGroup[];
            const result: RowGroup[] = [];  

            for (const rowGroup of data) {
                let amt = 0;

                for (const subRow of rowGroup.data) {
                    amt += asNumber(subRow.data[column]);
                }

                const nextRowGroup = createRowGroup(rowGroup.rowId, rowGroup.data);
                nextRowGroup.selection = { ...rowGroup.selection, [alias]: amt };
                result.push(nextRowGroup);
            }
    
            next('data', result);
        };
    }
};
