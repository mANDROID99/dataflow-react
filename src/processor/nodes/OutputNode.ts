import { Scalar, OutputValue, DataType } from "../../types/nodeProcessorTypes";
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
        const property = config.property as string;

        return (input, next) => {
            const data = input.in as Scalar[];
            
            const values = data.map((value): OutputValue => {
                return {
                    type: DataType.OUTPUT_VALUE,
                    correlationId: value.correlationId,
                    parent: value.parent,
                    outputValue: value.value,
                    outputKey: property
                };
            });

            next('out', values);
        }
    }
} 
