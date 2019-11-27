import { GraphNodeProcessor, RowGroup, Row, Scalar, createScalar } from "./processorTypes";

type Input = {
    in: RowGroup[] | undefined;
}

type Output = {
    out: Scalar[];
}

export class SumProcessor implements GraphNodeProcessor<Input, Output> {
    private readonly columnKey: string;

    constructor(columnKey: string) {
        this.columnKey = columnKey;
    }

    process(input: Input, next: (out: Output) => void): void {
        const data = input.in;
        const result: Scalar[] = [];
        if (data) {
            for (const item of data) {
                let amt: number = 0;
                for (const row of item.rows) {
                    amt += this.asNumber(row.data[this.columnKey]);
                }
                result.push(createScalar(item.correlationId, item.parent, amt));
            }
        }
        next({
            out: result
        });
    }

    private asNumber(input: string | undefined): number {
        if (input) {
            return +input;
        } else {
            return 0;
        }
    }
}

