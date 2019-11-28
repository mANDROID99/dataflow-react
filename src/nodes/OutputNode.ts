import { GraphNodeProcessor, Scalar, OutputValue, DataType } from "./nodeDataTypes";
import { GraphNodeConfig, GraphNodeRole } from "../types/graphConfigTypes";
import { EditorType } from "../editor/components/editors/standardEditors";

type Input = {
    in: Scalar[];
}

type Output = {
    out: OutputValue[];
}

type Config = {
    property: string;
}

export const OUTPUT_NODE: GraphNodeConfig<Input, Output, Config> = {
    title: 'Output',
    role: GraphNodeRole.OUTPUT,
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
    createProcessor(config) {
        return new OutputProcessor(config.property);
    }
} 

export class OutputProcessor implements GraphNodeProcessor<Input, Output> {
    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    process(input: Input, next: (out: Output) => void): void {
        const data = input.in;
        const outputKey = this.key;
        const values = data.map((value): OutputValue => {
            return {
                type: DataType.OUTPUT_VALUE,
                correlationId: value.correlationId,
                parent: value.parent,
                outputValue: value.value,
                outputKey
            };
        });
        next({ out: values });
    }
}
