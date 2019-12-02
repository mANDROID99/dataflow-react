import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";
import { NodeValue, Scalar } from "../../types/nodeProcessorTypes";
import { mergeResults } from "../resultsMerger";

export const JOIN_NODE: GraphNodeConfig = {
    title: 'Line',
    menuGroup: 'Transform',
    ports: {
        in: {
            x: {
                initialValue: [],
                match: 'scalar[]'
            },
            y: {
                initialValue: [],
                match: 'scalar[]'
            },
            series: {
                initialValue: [],
                match: 'scalar[]'
            }
        },
        out: {
            // out: {
            //     type: 'scalar[]'
            // }
        }
    },
    fields: {
        input: {
            label: 'Series',
            initialValue: 'a + b',
            editor: EditorType.TEXT
        }
    },
    process(config) {
        const expr = config.input as string;

        return (input, next) => {
            const inputA = input.a as NodeValue<Scalar>[];
            const inputB = input.b as NodeValue<Scalar>[];
        }
    }
}

