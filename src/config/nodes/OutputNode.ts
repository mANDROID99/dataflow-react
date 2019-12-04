import { Scalar, OutputValue, createOutputValue } from "../nodeDataTypes";
import { GraphNodeConfig } from "graph/types/graphConfigTypes";
import { EditorType } from "graph/editor/editors/standardEditors";
import { ChartContext } from "./chartContext";

export const OUTPUT_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Output',
    isOutput: true,
    menuGroup: 'Output',
    ports: {
        in: {
            in: {
                label: 'In',
                initialValue: [],
                match: 'scalar[]'
            }
        },
        out: {}
    },
    fields: {
        property: {
            label: 'Property',
            editor: EditorType.SELECT,
            initialValue: '',
            inputParams: (context) => {
                return {
                    options: context.base.properties
                };
            }
        }
    },
    process({ node }) {
        const propertyName = node.fields.property as string;

        return (input, next) => {
            const data = input.in as Scalar[];
            
            const values = data.map((value): OutputValue => {
                return createOutputValue(value.rowId, propertyName, value.value);
            });

            next('out', values);
        };
    }
};
