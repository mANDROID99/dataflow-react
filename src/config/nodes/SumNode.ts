import { RowGroup, createRowGroup, Primitive } from "../nodeDataTypes";
import { GraphNodeConfig } from "graph/types/graphConfigTypes";
import { EditorType } from "graph/editor/editors/standardEditors";
import { ChartContext } from "./chartContext";

function asNumber(input: Primitive): number {
    if (input) {
        return +input;
    } else {
        return 0;
    }
}

export const SUM_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Sum',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                label: 'In',
                initialValue: [],
                match: 'rowgroup[]'
            }
        },
        out: {
            data: {
                label: 'Data',
                type: 'rowgroup[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.SELECT,
            inputParams(context) {
                return {
                    options: context.columns
                };
            }
        },
        key: {
            label: 'Key',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    process({ node }) {
        const column = node.fields.column as string;
        const key = node.fields.key as string;

        return (input, next) => {
            const data = input.in as RowGroup[];
            const result: RowGroup[] = [];  

            for (const rowGroup of data) {
                let amt = 0;

                for (const subRow of rowGroup.data) {
                    amt += asNumber(subRow.data[column]);
                }

                const nextRowGroup = createRowGroup(rowGroup.rowId, rowGroup.data);
                nextRowGroup.selection = { ...rowGroup.selection, [key]: amt };
                result.push(nextRowGroup);
            }
    
            next('data', result);
        };
    },
    modifyContext({ node, context }) {
        const key = node.fields.key as string;
        context.keys.push(key);
    }
};