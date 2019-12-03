import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { Row, RowGroup, Scalar, createScalar } from "../../types/nodeProcessorTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

export const SELECT_NODE: GraphNodeConfig = {
    title: 'Select',
    menuGroup: 'Transform',
    ports: {
        in: {
            data: {
                initialValue: [],
                match: ['row[]', 'rowgroup[]']
            }
        },
        out: {
            values: {
                type: 'scalar[]'
            }
        }
    },
    fields: {
        key: {
            initialValue: '',
            label: 'Key',
            editor: EditorType.TEXT
        }
    },
    process({ config }) {
        const key = config.key as string;

        return (input, next) => {
            const data = input.data as (Row | RowGroup)[];

            const result: Scalar[] = data.map((datum: Row | RowGroup) => {
                return createScalar(datum.rowId, datum.selection[key]);
            });

            next('values', result);
        };
    }
};
