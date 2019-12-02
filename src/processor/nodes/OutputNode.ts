import { Scalar, KeyValue, NodeValue, createKeyValueValue } from "../../types/nodeProcessorTypes";
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
        out: {
            out: {
                type: 'output[]'
            }
        }
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
            
            const values = data.map((value): NodeValue<KeyValue> => {
                return createKeyValueValue(
                    value.correlationId,
                    value.parent,
                    propertyName,
                    value.data.value
                );
            });

            next('out', values);
        }
    }
} 
