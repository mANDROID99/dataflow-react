import { Row, RowGroup, Scalar, createScalar } from "../nodeDataTypes";
import { GraphNodeConfig } from "graph/types/graphConfigTypes";
import { EditorType } from "graph/editor/editors/standardEditors";
import { ChartContext } from "./chartContext";

export const SELECT_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Select',
    menuGroup: 'Transform',
    ports: {
        in: {
            data: {
                label: 'Data',
                initialValue: [],
                match: ['row[]', 'rowgroup[]']
            }
        },
        out: {
            values: {
                label: 'Values',
                type: 'scalar[]'
            }
        }
    },
    fields: {
        key: {
            initialValue: '',
            label: 'Key',
            editor: EditorType.SELECT,
            inputParams: (context) => ({
                options: context.keys
            })
        }
    },
    process({ node }) {
        const key = node.fields.key as string;

        return (input, next) => {
            const data = input.data as (Row | RowGroup)[];

            const result: Scalar[] = data.map((datum: Row | RowGroup) => {
                return createScalar(datum.rowId, datum.selection[key]);
            });

            next('values', result);
        };
    }
};
