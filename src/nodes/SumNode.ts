import { GraphNodeProcessor, RowGroup, Scalar, createScalar } from "./nodeDataTypes";
import { GraphNodeConfig } from "../types/graphConfigTypes";
import { EditorType } from "../editor/components/editors/standardEditors";

type Input = {
    in: RowGroup[];
}

type Output = {
    out: Scalar[];
}

type Config = {
    column: string;
}

export const SUM_NODE: GraphNodeConfig<Input, Output, Config> = {
    title: 'Sum',
    menuGroup: 'Transform',
    ports: {
        in: {
            in: {
                initialValue: [],
                match: 'rowgroup[]'
            }
        },
        out: {
            out: {
                type: 'scalar[]'
            }
        }
    },
    fields: {
        column: {
            label: 'Column',
            initialValue: '',
            editor: EditorType.TEXT
        }
    },
    createProcessor(config) {
        return new SumProcessor(config.column);
    }
}

export class SumProcessor implements GraphNodeProcessor<Input, Output> {
    private readonly columnKey: string;

    constructor(columnKey: string) {
        this.columnKey = columnKey;
    }

    process(input: Input, next: (out: Output) => void): void {
        const data = input.in;
        const result: Scalar[] = [];
        for (const item of data) {
            let amt: number = 0;
            for (const row of item.rows) {
                amt += this.asNumber(row.data[this.columnKey]);
            }
            result.push(createScalar(item.correlationId, item.parent, amt));
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

