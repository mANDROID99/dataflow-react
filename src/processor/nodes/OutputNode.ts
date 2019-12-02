import { Scalar, NodeValue, Selection, createSelectionValue } from "../../types/nodeProcessorTypes";
import { GraphNodeConfig } from "../../types/graphConfigTypes";
import { EditorType } from "../../editor/components/editors/standardEditors";

export const OUTPUT_NODE: GraphNodeConfig = {
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
            inputParams: (context: any) => {
                return {
                    options: context.properties
                };
            }
        }
    },
    process(config) {
        const propertyName = config.property as string;

        return (input, next) => {
            const data = input.in as NodeValue<Scalar>[];
            
            const values = data.map((value): NodeValue<Selection> => {
                const values = { [propertyName]: value.data.value };
                return createSelectionValue(
                    value.correlationId,
                    value.parent,
                    values
                );
            });

            next('out', values);
        }
    }
} 
