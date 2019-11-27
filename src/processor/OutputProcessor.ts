import { GraphNodeProcessor, Scalar, OutputValue, DataType } from "./processorTypes";

type Input = {
    in: Scalar[];
}

type Output = {
    out: OutputValue[];
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
