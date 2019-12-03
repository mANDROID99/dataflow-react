import { Scalar, OutputValue, createOutputValue } from "../../types/processorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";
import { ChartContext } from "./context";

export const OUTPUT_NODE: GraphNodeConfig<ChartContext> = {
    title: 'Output',
    isOutput: true,
    menuGroup: 'Output',
    ports: {
        in: {
            in: {
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
